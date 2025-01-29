import { useState, useEffect } from "react";
import { getHotels } from "../hooks/useHotels";
import HotelCard from "../components/HotelCard";
import './styles/hotels.scss'

export default function Hotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);

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

  return (
    <div className="hotel-list">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
}
