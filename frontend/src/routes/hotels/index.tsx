import { useEffect, useReducer, useState } from 'react'
import HotelCard from '../../components/HotelCard.tsx'
import Find from '../../components/Find.tsx'

import { getHotels } from '../../hooks/useHotels.ts'

import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import { useAtom } from 'jotai'
import { sortByAtom } from '@store'

import '../styles/hotels.scss'
import axios from 'axios'

export const Route = createFileRoute('/hotels/')({
  component: Hotels,
})

/**
 * Component for the /hotels route.
 *
 * @returns JSX for the hotels list page.
 */

function Hotels() {
  const [sortBy] = useAtom(sortByAtom)
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()
  const hotels = queryClient.getQueryData<Hotel[]>(['hotels', 'all']) || []
  const [sortMode, dispatchSortMode] = useReducer(sortModeReducer, 'asc')

  function sortModeReducer(state: 'asc' | 'desc', action: { type: 'toggle' }) {
    switch (action.type) {
      case 'toggle':
        return state === 'asc' ? 'desc' : 'asc'
      default:
        return 'asc'
    }
  }

  function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
      const timeout = setTimeout(() => setDebouncedValue(value), delay)
      return () => clearTimeout(timeout)
    }, [value])
    return debouncedValue
  }

  const {
    register,
    handleSubmit: formHandleSubmit,
    setValue,
    watch,
  } = useForm<{
    location: string
    price: [number, number]
    rating: [number, number]
    searchQuery: string
    payment: {
      card: boolean
      cash: boolean
    }
  }>({
    mode: 'onChange',
    defaultValues: {
      location: '',
      price: [-1, 0],
      rating: [1, 5],
      searchQuery: '',
      payment: {
        card: false,
        cash: false,
      },
    },
  })

  const search = useDebounce(watch('searchQuery'), 700)
  const payment = watch('payment')
  const location = useDebounce(watch('location'), 700)
  const rating = useDebounce(watch('rating'), 200)
  const price = useDebounce(watch('price'), 200)

  const { data: priceRange } = useQuery({
    queryKey: ['price-range'],
    queryFn: async () => {
      const {
        data: { price },
      } = await axios.get<{ price: { min: number; max: number } }>(
        'http://localhost:3000/api/v1/hotels/price-range',
      )
      return price
    },
    initialData: null,
  })

  const { isFetching } = useQuery<Hotel[]>({
    queryKey: [
      'hotels',
      'infinite',
      page,
      sortBy,
      search,
      payment.card,
      payment.cash,
      location,
      price,
      rating,
      sortMode,
    ],
    queryFn: async () => {
      const response = await getHotels({
        offset: (page - 1) * 30,
        location: encodeURI(location),
        price,
        payment,
        rating,
        searchQuery: encodeURI(search),
        sortBy: sortBy ? sortBy + '-' + sortMode : '',
      })

      queryClient.setQueryData<Hotel[]>(['hotels', 'all'], (old = []) => {
        if (page === 1) return response
        return [...old, ...response].filter(
          (hotel, index, self) =>
            index === self.findIndex((h) => h.id === hotel.id),
        )
      })
      return response
    },
    enabled: price[0] !== -1,
  })

  const observe: IntersectionObserverCallback = (entries) => {
    if (!entries) return
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isFetching) {
        setPage((prev) => prev + 1)
        observer.unobserve(entry.target)
      }
    })
  }

  const observer = new IntersectionObserver(observe, {
    root: null,
    rootMargin: '0px',
    threshold: 1,
  })

  useEffect(() => {
    if (!hotels.length) return
    const hotelCards = document.querySelectorAll('.hotel-card')
    const dividable: number[] = []

    for (let i = 0; i < hotelCards.length; i++)
      if ((i + 1) % 20 === 0) dividable.push(i)

    const toObserve = hotelCards[dividable[dividable.length - 1]]
    if (!toObserve) return
    observer.observe(toObserve)

    return () => {
      if (toObserve) observer.unobserve(toObserve)
    }
  }, [hotels])

  useEffect(() => {
    setPage(1)
    queryClient.invalidateQueries({ queryKey: ['hotels', 'all'] })
  }, [sortBy, search, payment.card, payment.cash, location, price, rating])

  useEffect(() => {
    if (priceRange) {
      const roundedMax = Math.ceil(priceRange.max / 500) * 500
      setValue('price', [priceRange.min, roundedMax])
    }
  }, [priceRange])

  return (
    <>
      <Find
        sortMode={sortMode}
        dispatchSortMode={dispatchSortMode}
        priceRange={priceRange}
        refetch={() => queryClient.invalidateQueries({ queryKey: ['hotels'] })}
        register={register}
        handleSubmit={formHandleSubmit}
        setValue={setValue}
        formPrice={watch('price')}
      />
      <div className="hotel-list">
        {hotels.map((hotel, idx) => (
          <HotelCard idx={idx} key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </>
  )
}
