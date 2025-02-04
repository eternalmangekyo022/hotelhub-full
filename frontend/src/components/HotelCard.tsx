import { useState, useEffect } from "react";
import star from "../assets/images/star.png";
import emptyStar from "../assets/images/empty_star.png";

const HotelCard = ({ hotel: { id, city, payment, price, name, images, description, class: _class, averageRating, ratingCount } }: { hotel: Hotel }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

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

  const roundedRating = Math.round(averageRating || 0);

  const totalStars = 5; // Total number of stars to display

  const stars = Array.from({ length: totalStars }, (_, index) => 

    index < roundedRating ? star : emptyStar

  );

  return (
    <div className="hotel-card" onClick={() => window.open(`/hotel/${id}`, "_blank")}>
      <h2 className="hotel-title">{name}</h2>

      <div className="thumb-img-container">
        <button className="prev" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
          <img src="https://www.svgrepo.com/show/440707/action-paging-prev.svg" alt="prev" />
        </button>
        <button className="next" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
          <img src="https://www.svgrepo.com/show/440707/action-paging-prev.svg" alt="next" />
        </button>
        {loadedImages[imgIndex] ? (
          <img
            src={loadedImages[imgIndex]}
            alt={name}
            className="thumb-img"
          />
        ) : (
          <div className="image-placeholder">Loading...</div>
        )}
      </div>
      <p className="hotel-text">
        <strong>City:</strong> {city}
      </p>
      <p className="hotel-price">
        <strong></strong> ${price} <span>per night</span>
      </p>
      <p className="hotel-text">
        <strong>Payment:</strong> {payment}
      </p>
      <p className="hotel-text">
        <strong>Class:</strong> {_class} stars
      </p>

      {/* Display average rating and total count */}
      <p className="hotel-text">
        <span className="rating-stars">
          {stars.map((star, index) => (
            <img key={index} src={star} alt={index < roundedRating ? star : emptyStar} />
          ))}
        </span>
        <span style={{ margin: '.2rem'}}>{`(${ratingCount || 0})`}</span>

      </p>
      
    </div>
  );
};

export default HotelCard;