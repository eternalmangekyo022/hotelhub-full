import { useState } from "react";

const styles = {
  hotelCard: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "16px",
    width: "280px",
    boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
    textAlign: "center",
  } as React.CSSProperties,

  hotelCardHover: {
    transform: "scale(1.05)",
    boxShadow: "4px 8px 20px rgba(0, 0, 0, 0.3)",
  } as React.CSSProperties,

  hotelTitle: {
    fontSize: "1.4rem",
    marginBottom: "8px",
    color: "#333",
  } as React.CSSProperties,

  hotelText: {
    margin: "6px 0",
    fontSize: "1rem",
    color: "#666",
  } as React.CSSProperties,

  hotelStrong: {
    color: "#000",
  } as React.CSSProperties,

  hotelButton: {
    marginTop: "12px",
    padding: "10px 16px",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
  } as React.CSSProperties,

  hotelButtonHover: {
    backgroundColor: "#0056b3",
  } as React.CSSProperties,
};

// Hotel card component
export default function HotelCard({ hotel }: { hotel: Hotel }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.hotelCard,
        ...(isHovered ? styles.hotelCardHover : {}),
      }}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      <img
      src={hotel.thumb}
      alt={hotel.name}
      className='thumb-img'
      loading="lazy"/>
      <h2 style={styles.hotelTitle}>{hotel.name}</h2>
      <p style={styles.hotelText}>
        <strong style={styles.hotelStrong}>City:</strong> {hotel.city}
      </p>
      <p style={styles.hotelText}>
        <strong style={styles.hotelStrong}>Price:</strong> ${hotel.price} per night
      </p>
      <p style={styles.hotelText}>
        <strong style={styles.hotelStrong}>Payment:</strong> {hotel.payment}
      </p>
      <p style={styles.hotelText}>
        <strong style={styles.hotelStrong}>Class:</strong> {hotel.class} stars
      </p>
      <p style={styles.hotelText}>{hotel.description}</p>

      {/* Display average rating and total count */}
      <p style={styles.hotelText}>
        <strong style={styles.hotelStrong}>Average Rating:</strong>{" "}
        {hotel.averageRating ? hotel.averageRating.toFixed(1) : "No ratings yet"}
      </p>
      <p style={styles.hotelText}>
        <strong style={styles.hotelStrong}>Total Ratings:</strong> {hotel.ratingCount || 0}
      </p>

      <button className="details-btn"
        style={styles.hotelButton}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.hotelButton.backgroundColor as string)}
      >
        See Details
      </button>
    </div>
  );
}