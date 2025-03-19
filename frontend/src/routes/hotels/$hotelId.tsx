import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { selectedHotelAtom } from "@store";
import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import { favoritesAtom } from "@store";
import Amenity from "../../components/Amenity.tsx";
import star from "../../assets/images/star.png";
import emptyStar from "../../assets/images/empty_star.png";
import "../styles/details.scss";

export const Route = createFileRoute("/hotels/$hotelId")({
  component: HotelDetails,
});
export default function HotelDetails() {
  const { hotelId } = Route.useParams();
  const [stars, setStars] = useState<string[]>([]);
  const [added, setAdded] = useState(false);
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
  });



  useEffect(() => {
    if (favorites.includes(Number(hotelId))) {
      setAdded(true);
    } else {
      setAdded(false);
    }
  });

  function addFav() {
    setFavorites((prev) => {
      if (!prev.includes(Number(hotelId))) {
        setAdded(true);
        return [...prev, Number(hotelId)];
      }
      return prev;
    });
  }

  function removeFav() {
    setFavorites((prev) => prev.filter((id) => id !== Number(hotelId)));
    setAdded(false);
  }

  useEffect(() => {
    if (hotel) {
      const roundedRating = Math.round(hotel.rating.avg);
      const totalStars = 5;
      setStars(
        Array.from({ length: totalStars }, (_, index) =>
          index < roundedRating ? star : emptyStar
        )
      );
    }
  }, [hotel]);

  if (!hotel) return <div className="loading">Loading hotel details...</div>;

  return (
    <>
      <div className="hotel-details">
        <h1>{hotel.name}</h1>
        <div className="w-96 h-64 bg-white">
          <div className="du-carousel w-full h-full">
            {hotel?.images.map((i, id, arr) => (
              <div
                key={i.full}
                id={`slide${id + 1}`}
                className="du-carousel-item relative w-full"
              >
                <img
                  src={`/images/full/${i.full}`}
                  className="w-full object-cover"
                />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                  <a
                    href={`#slide${id === 0 ? arr.length : id}`}
                    className="du-btn du-btn-circle"
                  >
                    ❮
                  </a>
                  <a
                    href={`#slide${id === arr.length - 1 ? 1 : id + 2}`}
                    className="du-btn du-btn-circle"
                  >
                    ❯
                  </a>
                </div>
              </div>
            ))}
          </div>
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
                alt={index < hotel.rating.avg ? "star" : "empty star"}
              />
            ))}
          </span>
          <span
            style={{ margin: ".2rem" }}
          >{`(${hotel.rating.count || 0})`}</span>
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
                {amenities.map((amenity, idx: number) => (
                  <Amenity key={idx} amenity={amenity} idx={idx} />
                ))}
              </ul>
            </div>
          ) : (
            <p>No amenities available for this hotel.</p>
          )}
        </div>
        <button
          className={`du-btn-accent ${added ? " active" : ""}`}
          onClick={() => {
            if (!added) addFav();
            else removeFav();
          }}
        >
          {added ? "Remove from favorites" : "Add to favorites"}
        </button>
        <Link to={`/booking/${hotel.id}`}>
          <button className="du-btn-primary">Book now</button>
        </Link>
      </div>
    </>
  );
}
