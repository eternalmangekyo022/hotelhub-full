const HotelCard = ({ hotel: { city, payment, price, name, thumb, description, class: _class, averageRating, ratingCount } }: { hotel: Hotel }) => (
  <div className="hotel-card">
    <img
      src={thumb}
      alt={name}
      className="thumb-img"
      loading="lazy"
    />
    <h2 className="hotel-title">{name}</h2>
    <p className="hotel-text">
      <strong>City:</strong> {city}
    </p>
    <p className="hotel-text">
      <strong>Price:</strong> ${price} per night
    </p>
    <p className="hotel-text">
      <strong>Payment:</strong> {payment}
    </p>
    <p className="hotel-text">
      <strong>Class:</strong> {_class} stars
    </p>
    <p className="hotel-text">{description}</p>

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
);

export default HotelCard;