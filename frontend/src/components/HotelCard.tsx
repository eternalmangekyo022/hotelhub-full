export default function HotelCard({ hotel }: { hotel: Hotel }) {

  return <div className='hotel-card'>
      <img
      src={hotel.thumb}
      alt={hotel.name}
      className='thumb-img'
      loading="lazy"/>
      <h2 className="hotel-title">{hotel.name}</h2>
      <p className='hotel-text'>
        <strong>City:</strong> {hotel.city}
      </p>
      <p className='hotel-text'>
        <strong>Price:</strong> ${hotel.price} per night
      </p>
      <p className='hotel-text'>
        <strong>Payment:</strong> {hotel.payment}
      </p>
      <p className='hotel-text'>
        <strong>Class:</strong> {hotel.class} stars
      </p>
      <p className='hotel-text'>{hotel.description}</p>

      {/* Display average rating and total count */}
      <p className='hotel-text'>
        <strong>Average Rating:</strong>{" "}
        {hotel.averageRating ? hotel.averageRating.toFixed(1) : "No ratings yet"}
      </p>
      <p className='hotel-text'>
        <strong>Total Ratings:</strong> {hotel.ratingCount || 0}
      </p>

      <button className="details-btn">
        See Details
      </button>
    </div>
}