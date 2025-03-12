import { useState, useEffect, useRef, type JSX } from "react";
import Star from "../assets/images/star.png";
import EmptyStart from "../assets/images/empty_star.png";
import LocationPin from "../assets/images/location-pin.png";
import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { selectedHotelAtom } from "../store.ts";

interface IStar {
  roundedRating: number;
  src: string;
}

export default function HotelCard({
  hotel: {
    id,
    description,
    city,
    payment,
    price,
    name,
    images,
    class: _class,
    rating: { avg, count },
  },
  idx,
  Loader,
}: { hotel: Hotel } & { idx: number; Loader: () => JSX.Element }) {
  const [stars, setStars] = useState<IStar[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [, setSelectedHotel] = useAtom(selectedHotelAtom);
  const [imageLoaded, setImageLoaded] = useState(false);

  function handleClick() {
    setSelectedHotel({
      city,
      class: _class,
      description,
      id,
      images,
      name,
      payment,
      price,
      rating: { avg, count },
    } as Hotel);
    navigate({ to: `/hotels/${id}` });
  }

  useEffect(() => {
    const roundedRating = Math.round(avg || 0);

    setStars(
      Array.from({ length: 5 }, (_, index) => ({
        roundedRating: index + 1,
        src: index < roundedRating ? Star : EmptyStart,
      }))
    );

    ref.current?.setAttribute("data-idx", (idx + 1).toString());
  }, []);

  return (
    <div ref={ref} className="hotel-card" onClick={handleClick}>
      <h2 className="hotel-title">{name}</h2>

      <div className="thumb-img-container">
        <img
          src={`/images/thumb/${images[0].thumb}`}
          alt={name}
          className={`thumb-img${imageLoaded ? "" : " disabled"}`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="thumb-img skeleton">
            <div className="skeleton-bar"></div>
            <Loader />
          </div>
        )}
      </div>
      <p className="hotel-text">
        <img src={LocationPin} alt="" className="location-pin" />
        {city}
      </p>
      <p className="hotel-price">
        <strong></strong> ${price} <span>per night</span>
      </p>
      <p className="hotel-text">
        <span className="rating-stars">
          {stars.map((star, index) => (
            <img
              key={index}
              src={star.src}
              alt={
                index < star.roundedRating
                  ? star.roundedRating.toString()
                  : EmptyStart
              }
            />
          ))}
        </span>
        <span style={{ margin: ".2rem" }}>{`(${count || 0})`}</span>
      </p>
    </div>
  );
}
