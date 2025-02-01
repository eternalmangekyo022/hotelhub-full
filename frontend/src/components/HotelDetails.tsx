import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHotels } from "../hooks/useHotels";
import "../routes/styles/details.scss";


const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const hotels = await getHotels();
        const selectedHotel = hotels.find((h) => h.id.toString() === id);
        setHotel(selectedHotel || null);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      }
    };

    fetchHotel();
  }, [id]);

  if (!hotel) return <div className="loading"></div>;

  return (
    <div className="hotel-details">
      <h1>{hotel.name}</h1>
      <img src={hotel.images[0]?.full} alt={hotel.name} className="hotel-image" style={{ width: "500px" }} />
      <p><strong>City:</strong> {hotel.city}</p>
      <p><strong>Price:</strong> ${hotel.price} per night</p>
      <p><strong>Payment:</strong> {hotel.payment}</p>
      <p><strong>Class:</strong> {hotel.class} stars</p>
      <p><strong>Description:</strong> {hotel.description}</p>
      <p><strong>Average Rating:</strong> {hotel.averageRating ? hotel.averageRating.toFixed(1) : "No ratings yet"}</p>
      <p><strong>Total Ratings:</strong> {hotel.ratingCount || 0}</p>
      <button className="book-now-btn">Book Now</button>
    </div>
  );
};

export default HotelDetails;
