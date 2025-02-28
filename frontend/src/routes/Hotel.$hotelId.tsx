import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { favoritesAtom, selectedHotelAtom } from "../store.ts";
import "../routes/styles/details.scss";
import star from "../assets/images/star.png";
import emptyStar from "../assets/images/empty_star.png";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/Hotel/$hotelId")({
  component: HotelDetails,
});

function HotelDetails() {
  const { hotelId } = Route.useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useAtom(favoritesAtom);
  const [selectedHotel] = useAtom(selectedHotelAtom);

  const { data: hotel } = useQuery({
    queryKey: ["hotel", hotelId],
    queryFn: async () => {
      const { data } = await axios.get<Hotel>(`/api/v1/hotels/${hotelId}`);
      return data;
    },
    enabled: !selectedHotel,
    initialData: selectedHotel,
  });

  function handlePrevImage() {
    if (hotel && hotel.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? hotel.images.length - 1 : prevIndex - 1
      );
    }
  }

  function handleNextImage() {
    if (hotel && hotel.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === hotel.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  }

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
          src="https://www.svgrepo.com/show/440707/action-paging-prev.svg"
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
      <button
        className="book-now-btn"
        onClick={() => setFavorites((prev) => [...prev, hotel.id])}
      >
        Add to Favorites
      </button>
    </div>
  );
}

export default HotelDetails;
