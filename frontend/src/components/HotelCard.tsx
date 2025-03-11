import { useState, useEffect, useRef } from "react";
import Star from "../assets/images/star.png";
import EmptyStart from "../assets/images/empty_star.png";
import LocationPin from "../assets/images/location-pin.png";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { selectedHotelAtom } from "../store.ts";
import HouseSvg from "./HouseSvg";
import ApartmentSvg from "./ApartmentSvg";

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
  const [imgIndex, setImgIndex] = useState(0);
  const [stars, setStars] = useState<IStar[]>([]);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [, setSelectedHotel] = useAtom(selectedHotelAtom);

  useEffect(() => {
    if (images.length > 0) {
      const img = new Image();
      img.src = `/images/thumb/${images[0].thumb}`;
      img.onload = () => {
        setLoadedImages([`/images/thumb/${images[0].thumb}`]);
      };
    }

    const loadImages = async () => {
      for (let i = 1; i < images.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
        const img = new Image();
        img.src = `/images/thumb/${images[0].thumb}`;
        img.onload = () => {
          setLoadedImages((prev) => [
            ...prev,
            `/images/thumb/${images[0].thumb}`,
          ]);
        };
      }
    };

    loadImages();
  }, [images]);

  const handlePrev = () => {
    setImgIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setImgIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };
  // Calculate the number of filled and empty stars

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
        <button
          className="prev"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
        >
          <img
            src="https://www.svgrepo.com/show/440707/action-paging-prev.svg"
            alt="prev"
          />
        </button>
        <button
          className="next"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
        >
          <img
            src="https://www.svgrepo.com/show/440707/action-paging-prev.svg"
            alt="next"
          />
        </button>
        {loadedImages[imgIndex] ? (
          <img src={loadedImages[imgIndex]} alt={name} className="thumb-img" />
        ) : (
          <div className="thumb-img skeleton">
            <div className="skeleton-bar"></div>
            <HouseSvg />
            <ApartmentSvg />
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
      <Link to={`/Booking`}>
        <button className="book-btn">Book Now</button>
      </Link>
    </div>
  );
}
