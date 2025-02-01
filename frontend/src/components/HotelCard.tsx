import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HotelCard = ({ hotel: { id, city, payment, price, name, images, description, class: _class, averageRating, ratingCount } }: { hotel: Hotel }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const navigate = useNavigate();

  console.log(images)

  return <div className="hotel-card" onClick={() => navigate(`/hotel/${id}`)}>
    <h2 className="hotel-title">{name}</h2>

    <div className="thumb-img-container">
      <button className="prev">
        <img src="https://www.svgrepo.com/show/440707/action-paging-prev.svg" alt="prev" />
      </button>
      <button className="next">
        <img src="https://www.svgrepo.com/show/440707/action-paging-prev.svg" alt="next" />
      </button>
      <img
        src={images[imgIndex].thumb}
        alt={name}
        className="thumb-img"
      />
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
      <strong>Average Rating:</strong>{" "}
      {averageRating ? averageRating.toFixed(1) : "No ratings yet"}
    </p>
    <p className="hotel-text">
      <strong>Total Ratings:</strong> {ratingCount || 0}
    </p>

    <button className="details-btn">See Details</button>
  </div>
}
export default HotelCard;