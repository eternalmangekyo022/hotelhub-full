import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import z from "zod";

import "./styles/find.scss";
import { sortByAtom, searchQueryAtom } from "../store";

export default function Find() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const [rating, setRating] = useState("");
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [isSimple, setIsSimple] = useState(true);
  const [, setSearchQuery] = useAtom(searchQueryAtom);

  const [sortBy, setSortBy] = useAtom(sortByAtom);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortBySchema = z.enum([
      "",
      "name-asc",
      "name-desc",
      "location-asc",
      "location-desc",
      "rating-asc",
      "rating-desc",
      "ratingtotal-asc",
      "ratingtotal-desc",
      "price-asc",
      "price-desc",
    ]);
    if (!sortBySchema.safeParse(e.target.value).success) return;
    const toSortBy = e.target.value as ISortBy;
    setSortBy(toSortBy);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

        <label
          htmlFor="sort"
          className="du-select m-0 p-0 w-52 rounded-4xl not-dark:bg-neutral-content"
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
  );
}
