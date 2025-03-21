import { useEffect, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import z from 'zod'
import { useForm } from 'react-hook-form'

import './styles/find.scss'
import { sortByAtom, searchQueryAtom } from '../store'
import AngleSvg from './svg/AngleSvg';
import { motion as m } from 'motion/react';

export default function Find() {
  const searchRef = useRef<HTMLInputElement>(null)
  const [isSimple, setIsSimple] = useState(true)
  const [, setSearchQuery] = useAtom(searchQueryAtom)
  const { register, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      location: '',
      rating: '',
    }
  })

  const [sortBy, setSortBy] = useAtom(sortByAtom)

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortBySchema = z.enum([
      '',
      'name-asc',
      'name-desc',
      'location-asc',
      'location-desc',
      'rating-asc',
      'rating-desc',
      'ratingtotal-asc',
      'ratingtotal-desc',
      'price-asc',
      'price-desc',
    ])
    if (!sortBySchema.safeParse(e.target.value).success) return
    const toSortBy = e.target.value as ISortBy
    setSortBy(toSortBy)
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
              ref={searchRef}
              type="search"
              className="grow"
              placeholder="Search"
            />
            <kbd className="du-kbd du-kbd-sm not-dark:bg-gray-300">Ctrl</kbd>
            <kbd className="du-kbd du-kbd-sm not-dark:bg-gray-300">K</kbd>
          </label>
        </div>

        <div className='flex flex-col items-center pb-4'>
          <AngleSvg active={isSimple} onClick={() => setIsSimple(prev => !prev)} />
          <m.div className="w-full flex flex-col items-center justify-evenly" initial={{
            height: isSimple ? '0' : 'auto',
            opacity: isSimple ? 0 : 1,
          }} animate={{
            height: isSimple ? '0' : 'auto',
            opacity: isSimple ? 0 : 1,
            transition: {
              duration: 0.3,
              ease: 'easeInOut'
            }
          }}>
            <fieldset className="du-fieldset w-3xs">
              <legend className="du-fieldset-legend">Location</legend>
              <input type="text" className="du-input" placeholder="e.g. New York" {...register('location')} />
            </fieldset>
            <fieldset className="du-fieldset w-3xs">
              <legend className="du-fieldset-legend">Rating</legend>
              <input type="text" className="du-input" placeholder="e.g. 4.5" {...register('rating')} />
            </fieldset>
          </m.div>
        </div>

        <label
          htmlFor="sort"
          className="du-select not-dark:bg-neutral-content m-0 w-52 rounded-4xl p-0"
        >
          <span className="du-label">Sort</span>
          <select id="sort" value={sortBy} onChange={handleSortChange}>
            <option value="">None</option>
            <option value="name-asc">A -&gt; Z</option>
            <option value="name-desc">Z -&gt; A</option>
            <option value="rating-asc">Rating (Low to High)</option>
            <option value="rating-desc">Rating (High to Low)</option>
            <option value="ratingtotal-asc">Rating Count (Low to High)</option>
            <option value="ratingtotal-desc">Rating Count (High to Low)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </label>
      </div>
    </section>
  )
}
