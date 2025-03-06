import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { favoritesAtom, selectedHotelAtom } from "../../store.ts";
import "../styles/details.scss";
import star from "../../assets/images/star.png";
import emptyStar from "../../assets/images/empty_star.png";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/hotels/$hotelId")({
  component: HotelDetails,
});

export default function HotelDetails() {
  const { hotelId } = Route.useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favorites, setFavorites] = useAtom(favoritesAtom);
  const [selectedHotel] = useAtom(selectedHotelAtom);

  const { data: hotel } = useQuery({
    queryKey: ["hotel", hotelId],
    queryFn: async () => {
      const { data } = await axios.get<Hotel>(
        `http://localhost:3000/api/v1/hotels/id/${hotelId}`
      );
      return data;
    },
    enabled: !selectedHotel,
    initialData: selectedHotel,
    refetchOnWindowFocus: false,
  });

  const { data: amenities, isLoading: isAmenitiesLoading } = useQuery({
    queryKey: ["amenities", hotelId],
    queryFn: async () => {
      const { data } = await axios.get<Amenity[]>(
        `http://localhost:3000/api/v1/amenities/${hotelId}`
      );
      return data;
    },
    initialData: [],
    refetchOnWindowFocus: false,
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

  async function importImage(url: string) {
    try {
      const fullPath = `../../assets/vectors/${url}`;
      const response = await import(fullPath);
      return response.default;
    } catch (e) {
      console.error(e);
    }
  }

  const roundedRating = Math.round(hotel?.averageRating || 0);
  const totalStars = 5;
  const stars = Array.from({ length: totalStars }, (_, index) =>
    index < roundedRating ? star : emptyStar
  );

  if (!hotel) return <div className="loading">Loading hotel details...</div>;

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
      <div>
        <p>
          <strong>Amenities:</strong>
        </p>

        {isAmenitiesLoading ? (
          <p>Loading amenities...</p>
        ) : amenities.length > 0 ? (
          <div className="amenities-container">
            <ul className="amenities-list">
              {amenities.map(async (amenity, index: number) => {
                return (
                  <li key={index}>
                    <span>
                      <img
                        src={await importImage(amenity.img)}
                        width="20"
                        alt={amenity.img}
                      />
                    </span>
                    {amenity.amenity}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p>No amenities available for this hotel.</p>
        )}
      </div>
      <button
  className="book-now-btn"
  onClick={() => {
    console.log("Button clicked");
    if (!favorites.includes(hotel.id)) {
      setFavorites((prev) => [...prev, hotel.id]);
      alert("Added to favorites!"); // Shows a browser alert
    } else {
      alert("Already in favorites!");
    }
  }}
>
  Add to Favorites
</button>

    </div>
  );
}