import { useState, useEffect, useRef } from "react";
import star from "../assets/images/star.png";
import emptyStar from "../assets/images/empty_star.png";
import locationpin from "../assets/images/location-pin.png";
import { Link, useNavigate } from "@tanstack/react-router";
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
    averageRating,
    ratingCount,
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
    // Preload the first image immediately
    if (images.length > 0) {
      const img = new Image();
      img.src = images[0].thumb;
      img.onload = () => {
        setLoadedImages([images[0].thumb]);
      };
    }

    // Lazy load the rest of the images with a delay
    const loadImages = async () => {
      for (let i = 1; i < images.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
        const img = new Image();
        img.src = images[i].thumb;
        img.onload = () => {
          setLoadedImages((prev) => [...prev, images[i].thumb]);
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
      averageRating,
      city,
      class: _class,
      description,
      id,
      images,
      name,
      payment,
      price,
      ratingCount,
    } as Hotel);
    navigate({ to: `/hotels/${id}` });
  }

  useEffect(() => {
    const roundedRating = Math.round(averageRating || 0);

    setStars(
      Array.from({ length: 5 }, (_, index) => ({
        roundedRating: index + 1,
        src: index < roundedRating ? star : emptyStar,
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
          <div className="image-placeholder">Loading...</div>
        )}
      </div>
      <p className="hotel-text">
        <img src={locationpin} alt="" className="location-pin" />
        {city}
      </p>
      <p className="hotel-price">
        <strong></strong> ${price} <span>per night</span>
      </p>
      {/* Display average rating and total count */}
      <p className="hotel-text">
        <span className="rating-stars">
          {stars.map((star, index) => (
            <img
              key={index}
              src={star.src}
              alt={
                index < star.roundedRating
                  ? star.roundedRating.toString()
                  : emptyStar
              }
            />
          ))}
        </span>
        <span style={{ margin: ".2rem" }}>{`(${ratingCount || 0})`}</span>
      </p>
      <Link to={`/Booking`}>
      <button className="book-btn">Book Now</button>
      </Link>
    </div>
  );
}
