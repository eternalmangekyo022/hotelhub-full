import { useState, useEffect } from "react";
import { getHotels } from "../hooks/useHotels";
import HotelCard from "../components/HotelCard";
import Find from "../components/Find.tsx";

import "./styles/hotels.scss";

export default function Hotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    async function loadHotels() {
      try {
        const hotels = await getHotels();
        setHotels(hotels);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    }

    loadHotels();
  }, []);

  // Filter hotels based on the search query (case insensitive)
  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort hotels based on the selected sort criteria
  const sortedHotels = [...filteredHotels].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "rating-asc":
        return a.averageRating - b.averageRating;
      case "rating-desc":
        return b.averageRating - a.averageRating;
      case "ratingtotal-asc":
        return a.ratingCount - b.ratingCount;
      case "ratingtotal-desc":
        return b.ratingCount - a.ratingCount;
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      default:
        return 0; // No sorting
    }
  });

  return (
    <>
      <Find setSearchQuery={setSearchQuery} setSortBy={setSortBy} />
      <div className="hotel-list">
        {sortedHotels.map(hotel => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </>
  );
}