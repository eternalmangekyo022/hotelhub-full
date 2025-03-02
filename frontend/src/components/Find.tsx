import { useState } from "react";
import "./styles/find.scss";
import Filter from "../assets/images/Filter Iconvector.svg";
import Search from "../assets/images/Search Iconvector.svg";
import SearchPurple from "../assets/images/Search Iconvector Purple.svg";
import Location from "../assets/images/Location Iconvector.svg";
import z from "zod";

import { useAtom } from "jotai";
import { sortByAtom, searchQueryAtom } from "../store";

export default function Find() {
  const [input, setInput] = useState("");
  const [rating, setRating] = useState("");
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [isSimple, setIsSimple] = useState(true);
  const [selectedSort, setSelectedSort] = useState(""); // State to track selected sorting option
  const [, setSearchQuery] = useAtom(searchQueryAtom);

  const [, setSortBy] = useAtom(sortByAtom);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setSearchQuery(input || name); // Update search query in Hotels.tsx
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortBySchema = z.enum([
      "name-asc",
      "name-desc",
      "location-asc",
      "location-desc",
      "rating-asc",
      "rating-desc",
    ]);
    if (!sortBySchema.safeParse(e.target.value).success) return;
    const sortBy = e.target.value as ISortBy;
    setSelectedSort(sortBy);
    setSortBy(sortBy); // Pass the selected sorting option to the parent
  };

  return (
    <section className="find-wrapper">
      <div className="search">
        <h1>Find Your Perfect Stay</h1>
        <h2>Search by Name, Location, or Ratings</h2>
        <div className="searchbar">
          <form
            onSubmit={onSubmit}
            className={`input${isSimple ? "" : " complex"}`}
          >
            {isSimple ? (
              <>
                <img
                  id="searchImage"
                  src={Search}
                  alt="Search icon"
                  title="Search"
                />
                <input
                  type="text"
                  placeholder="Search for hotels"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <img
                  id="filterImage"
                  onClick={() => setIsSimple(false)}
                  src={Filter}
                  alt="Filter"
                />
              </>
            ) : (
              <>
                <input
                  placeholder="Name"
                  type="text"
                  className="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="location-input">
                  <img src={Location} alt="Location" />
                  <input
                    placeholder="Location"
                    type="text"
                    className="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <input
                  placeholder="Rating"
                  type="number"
                  className="rating"
                  max={5}
                  min={0}
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />
                <button
                  className="simple-button"
                  onClick={() => setIsSimple(true)}
                >
                  Simple search
                </button>
              </>
            )}
            <button className="search-button" type="submit">
              <img src={SearchPurple} alt="Search" title="Search" />
            </button>
          </form>
        </div>

        {/* Sort By Section */}
        <div className="sort-by">
          <label htmlFor="sort">Sort By:</label>
          <select id="sort" value={selectedSort} onChange={handleSortChange}>
            <option value="">None</option>
            <option value="name-asc">Alphabetical (A-Z)</option>
            <option value="name-desc">Alphabetical (Z-A)</option>
            <option value="rating-asc">Rating (Low to High)</option>
            <option value="rating-desc">Rating (High to Low)</option>
            <option value="ratingtotal-asc">Rating Count (Low to High)</option>
            <option value="ratingtotal-desc">Rating Count (High to Low)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      </div>
    </section>
  );
}
