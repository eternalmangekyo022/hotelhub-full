import { useState, useEffect, useRef } from "react";
import Star from "../assets/images/star.png";
import EmptyStar from "../assets/images/empty_star.png";
import LocationPin from "../assets/images/location-pin.png";
import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { selectedHotelAtom } from "../store.ts";
import Arrow from "/vectors/arrow-up-right.svg";

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
}: { hotel: Hotel } & { idx: number }) {
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
    navigate({
      to: "/hotels/$hotelId",
      params: {
        hotelId: String(id),
      },
    });
  }

  useEffect(() => {
    const roundedRating = Math.round(avg || 0);

    setStars(
      Array.from({ length: 5 }, (_, index) => ({
        roundedRating: index + 1,
        src: index < roundedRating ? Star : EmptyStar,
      })),
    );

    ref.current?.setAttribute("data-idx", (idx + 1).toString());
  }, []);

  return (
    <div
      ref={ref}
      className="hotel-card h-96 du-card-sm bg-base-100 w-96 shadow-xl rounded-md overflow-hidden"
    >
      <figure className="h-[55%] object-contain">
        {!imageLoaded && (
          <div className="flex w-full h-full flex-col">
            <div className="du-skeleton h-full w-full rounded-none"></div>
          </div>
        )}
        <img
          src={`/images/thumb/${images[0].thumb}`}
          alt={name}
          className={`w-full h-full object-cover${imageLoaded ? "" : " hidden"}`}
          onLoad={() => setImageLoaded(true)}
        />
      </figure>
      <div className="du-card-body not-dark:bg-blue-200 dark:bg-[#242a34] text-white h-[45%]">
        <div className="flex justify-between items-center">
          <h2 className="du-card-title truncate not-dark:text-black">
            {name}
          </h2>
        </div>
        <p className="flex items-center not-dark:text-black">
          <img src={LocationPin} alt="pin" className="w-4 h-4 mr-2" />
          {city}
        </p>
        <p className="text-lg font-semibold not-dark:text-black">
          ${price} <span className="text-sm text-gray-500">per night</span>
        </p>
        <div className="du-card-actions justify-between items-center h-16">
          <div className="rating-stars flex items-center w-1/3">
            {stars.map((star, index) => (
              <img
                key={index}
                src={star.src}
                alt={index < star.roundedRating ? "Filled Star" : "Empty Star"}
                className="w-4 h-4 object-contain"
              />
            ))}
            <span className="ml-2 text-sm text-gray-500">({count || 0})</span>
          </div>
          <button onClick={handleClick} className="du-btn du-btn-info">
            View Details
            <img src={Arrow} alt="" className="inline w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
