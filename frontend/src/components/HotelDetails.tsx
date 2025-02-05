import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHotels } from "../hooks/useHotels";
import star from "../assets/images/star.png";
import emptyStar from "../assets/images/empty_star.png";
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

  const roundedRating = Math.round(hotel?.averageRating || 0);

  const totalStars = 5; // Total number of stars to display

  const stars = Array.from({ length: totalStars }, (_, index) => 

    index < roundedRating ? star : emptyStar

  );

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
      <p>
        <span className="rating-stars">
          {stars.map((star, index) => (
            <img key={index} src={star} alt={index < roundedRating ? star : emptyStar} />
          ))}
        </span>
        <span style={{ margin: '.2rem'}}>{`(${hotel.ratingCount || 0})`}</span>
      </p>
      <button className="book-now-btn">Book Now</button>
    </div>
  );
};

export default HotelDetails;
