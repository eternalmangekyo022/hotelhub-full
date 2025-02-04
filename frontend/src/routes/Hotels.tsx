import { useState, useEffect } from "react";
import { getHotels } from "../hooks/useHotels";
import HotelCard from "../components/HotelCard";
import Find from "../components/Find.tsx";

import "./styles/hotels.scss";

export default function Hotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <>
      <Find setSearchQuery={setSearchQuery} />
      <div className="hotel-list">
        {filteredHotels.map(hotel => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </>
  );
}
