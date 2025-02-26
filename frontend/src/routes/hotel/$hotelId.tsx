import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hotel/$hotelId")({
  component: HotelDetails,
});

import { useEffect, useState } from "react";
import { getHotels } from "../../hooks/useHotels";
import star from "../../assets/images/star.png";
import emptyStar from "../../assets/images/empty_star.png";
import "../styles/details.scss";
import { useWishlist } from "../../components/WishListContext";

function HotelDetails() {
  const { hotelId } = Route.useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToWishlist } = useWishlist();

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
  }, []);

  const handlePrevImage = () => {
    if (hotel && hotel.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? hotel.images.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNextImage = () => {
    if (hotel && hotel.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === hotel.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const roundedRating = Math.round(hotel?.averageRating || 0);
  const totalStars = 5;
  const stars = Array.from({ length: totalStars }, (_, index) =>
    index < roundedRating ? star : emptyStar
  );

  if (!hotel) return <div className="loading"></div>;

  return (
    <div className="hotel-details">
      <h1>{hotel.name}</h1>
      <div className="image-container">
        <img
          src={"https://www.svgrepo.com/show/440707/action-paging-prev.svg"}
          alt="Previous"
          className="arrow"
          onClick={handlePrevImage}
        />
        <img
          src={hotel.images[currentImageIndex]?.full}
          alt={hotel.name}
          className="hotel-image"
        />
        <img
          src={"https://www.svgrepo.com/show/440707/action-paging-prev.svg"}
          alt="Next"
          className="other-arrow"
          onClick={handleNextImage}
        />
      </div>
      <p>
        <strong>City:</strong> {hotel.city}
      </p>
      <p>
        <strong>Price:</strong> ${hotel.price} per night
      </p>
      <p>
        <strong>Payment:</strong> {hotel.payment}
      </p>
      <p>
        <strong>Class:</strong> {hotel.class} stars
      </p>
      <p>
        <strong>Description:</strong> {hotel.description}
      </p>
      <p>
        <span className="rating-stars">
          {stars.map((star, index) => (
            <img
              key={index}
              src={star}
              alt={index < roundedRating ? "star" : "empty star"}
            />
          ))}
        </span>
        <span style={{ margin: ".2rem" }}>{`(${hotel.ratingCount || 0})`}</span>
      </p>
      <button className="book-now-btn" onClick={() => addToWishlist(hotel)}>
        Add to Wishlist
      </button>
    </div>
  );
}

export default HotelDetails;
