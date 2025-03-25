import { useEffect, useRef, useState, FormEventHandler } from 'react'
import { UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { motion as m } from 'motion/react'
import RangeSlider from 'react-range-slider-input'
import { useAtom } from 'jotai'

import 'react-range-slider-input/dist/style.css'
import './styles/find.scss'

import { sortByAtom } from '../store'
import AngleSvg from './svg/Angle'

import SortMode from './svg/SortMode'

type ISetValue = UseFormSetValue<{
  location: string
  price: number[]
  payment: {
    card: boolean
    cash: boolean
  }
  rating: number[]
  searchQuery: string
}>

type IRegister = UseFormRegister<{
  location: string
  price: number[]
  payment: {
    card: boolean
    cash: boolean
  }
  rating: number[]
  searchQuery: string
}>

export interface IHandleSubmit {
  (
    onValid: (data: {
      location: string
      price: number[]
      payment: {
        card: boolean
        cash: boolean
      }
      rating: number[]
      searchQuery: string
    }) => void,
  ): FormEventHandler<HTMLFormElement>
}

type ISortMode = 'asc' | 'desc'

export default function Find({
  sortMode,
  dispatchSortMode,
  priceRange,
  refetch,
  register,
  handleSubmit,
  setValue,
}: {
  sortMode: ISortMode
  dispatchSortMode: React.ActionDispatch<
    [
      action: {
        type: 'toggle'
      },
    ]
  >
  priceRange?: { min: number; max: number } | null
  refetch: () => void
  register: IRegister
  handleSubmit: IHandleSubmit
  setValue: ISetValue
}) {
  const searchRef = useRef<HTMLInputElement>(null)
  const [isSimple, setIsSimple] = useState(true)
  const [sortBy, setSortBy] = useAtom(sortByAtom)

  const [rating, setRating] = useState({
    visible: false,
    value: [1, 5],
  })

  const [price, setPrice] = useState({
    visible: false,
    value: [1, 1000],
  })

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const toSortBy = e.target.value as ISortBy
    setSortBy(toSortBy)
  }

  function showRating() {
    setRating((prev) => ({
      ...prev,
      visible: true,
    }))
  }

  function showPrice() {
    setPrice((prev) => ({
      ...prev,
      visible: true,
    }))
  }

  function resetRating() {
    setRating((prev) => ({
      ...prev,
      visible: false,
    }))
    refetch()
  }

  function resetPrice() {
    setPrice((prev) => ({
      ...prev,
      visible: false,
    }))
    refetch()
  }

  function handleOnSubmit(data: any) {
    console.log(data)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.ctrlKey) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        searchRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <section className="find-wrapper">
      <div className="search">
        <h1>Find Your Perfect Stay</h1>
        <h2>Search by Name, Location, or Ratings</h2>
        <div className="searchbar">
          <label className="du-input not-dark:bg-neutral-content">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              className="grow"
              placeholder="Search"
              {...register('searchQuery')}
              onChange={(e) => setValue('searchQuery', e.target.value)}
              ref={searchRef}
            />
            <kbd className="du-kbd du-kbd-sm not-dark:bg-gray-300">Ctrl</kbd>
            <kbd className="du-kbd du-kbd-sm not-dark:bg-gray-300">K</kbd>
          </label>
        </div>

        <div className="flex w-lg flex-col items-center pb-4 **:not-dark:text-black not-dark:[&_input,&_select]:bg-neutral-200 [&>div>fieldset]:w-6/7">
          <AngleSvg
            active={isSimple}
            onClick={() => setIsSimple((prev) => !prev)}
          />
          <m.form
            onSubmit={handleSubmit(handleOnSubmit)}
            className="grid w-full grid-cols-2 grid-rows-3 items-center justify-evenly [&_fieldset]:m-auto! [&_fieldset]:w-[92.5%]!"
            initial={{
              height: isSimple ? '0' : 'auto',
              opacity: isSimple ? 0 : 1,
            }}
            animate={{
              height: isSimple ? '0' : 'auto',
              opacity: isSimple ? 0 : 1,
              transition: {
                duration: 0.3,
                ease: 'easeInOut',
              },
            }}
          >
            <fieldset className="du-fieldset">
              <legend className="du-fieldset-legend">Location</legend>
              <input
                type="text"
                className="du-input"
                placeholder="e.g. New York"
                {...register('location')}
              />
            </fieldset>
            <fieldset className="du-fieldset flex h-full flex-row justify-start gap-5 [&>label]:select-none [&>label>input]:border-stone-300 [&>label>input:checked]:border-2">
              <legend className="du-fieldset-legend">Payment</legend>
              <label className="du-fieldset-label">
                <input
                  type="checkbox"
                  defaultChecked
                  className="du-checkbox border-0"
                  {...register('payment.card')}
                />
                Credit Card
              </label>
              <label className="du-fieldset-label">
                <input
                  type="checkbox"
                  defaultChecked
                  className="du-checkbox"
                  {...register('payment.cash')}
                />
                Cash
              </label>
            </fieldset>
            <fieldset className="du-fieldset w-[92.5%]!">
              <legend className="du-fieldset-legend">Rating </legend>
              <div
                className={
                  'du-tooltip du-tooltip-warning' +
                  (rating.visible ? ' du-tooltip-open' : '')
                }
                data-tip={rating.value.join(' - ')}
              >
                <RangeSlider
                  onRangeDragStart={showRating}
                  onThumbDragStart={showRating}
                  onThumbDragEnd={resetRating}
                  onRangeDragEnd={resetRating}
                  onInput={(e: [number, number]) => {
                    setValue('rating', e)
                    setRating((prev) => ({
                      ...prev,
                      value: e,
                    }))
                  }}
                  defaultValue={[1, 5]}
                  min={1}
                  step={1}
                  max={5}
                />
              </div>
            </fieldset>
            <fieldset className="du-fieldset w-[92.5%]!">
              <legend className="du-fieldset-legend">Price</legend>
              <div
                className={
                  'du-tooltip du-tooltip-success' +
                  (price.visible ? ' du-tooltip-open' : '')
                }
                data-tip={`${price.value[0] > 0 ? '$' + price.value.join(' - $') : '$' + price.value[1]}`}
              >
                <RangeSlider
                  onRangeDragEnd={resetPrice}
                  onThumbDragEnd={resetPrice}
                  step={20}
                  onRangeDragStart={showPrice}
                  onThumbDragStart={showPrice}
                  onInput={(e: [number, number]) => {
                    setValue('price', e)
                    setPrice((prev) => ({
                      ...prev,
                      value: e,
                    }))
                  }}
                  defaultValue={[priceRange?.min || 1, priceRange?.max || 5000]}
                  min={priceRange?.min || 1}
                  max={priceRange?.max || 5000}
                />
              </div>
            </fieldset>
          </m.form>
        </div>

        <label
          htmlFor="sort"
          className="du-select not-dark:bg-neutral-content m-0 w-52 rounded-4xl p-0"
        >
          <span className="du-label">Sort</span>
          <select id="sort" value={sortBy} onChange={handleSortChange}>
            <option value="">None</option>
            <option value="rating">Rating</option>
            <option value="ratingtotal">Reviews</option>
            <option value="price">Price</option>
          </select>
        </label>
        <button
          onClick={() => dispatchSortMode({ type: 'toggle' })}
          className="du-btn dark:bg-base-300 not-dark:bg-neutral-content size-10 border-none p-0"
        >
          <SortMode sortMode={sortMode} />
        </button>
      </div>
    </section>
  )
}
