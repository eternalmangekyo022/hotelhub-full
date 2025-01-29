import { useEffect, useState } from "react";

// Define the Hotel type
type Hotel = {
  id: number;
  name: string;
  price: number;
  city: string;
  payment: string;
  owner_id: number;
  coords: { x: number; y: number };
  class: number;
  description: string;
  thumb?: string; //  image URL
  averageRating?: number; //  rating
  ratingCount?: number; // rating count
};

// Fetch function to get hotels and their ratings
const fetchHotels = async (): Promise<Hotel[]> => {
  try {
    // Fetch hotels
    const hotelsResponse = await fetch("http://localhost:3000/api/v1/hotels");
    const hotels: Hotel[] = await hotelsResponse.json();

    // Fetch images with Authorization header
    const imagesResponse = await fetch("http://localhost:3000/api/v1/images", {
      headers: {
        Authorization: "Bearer pankix",
      },
    });

    const imagesData = await imagesResponse.json();
    const images: { id: number; thumb: string }[] = Array.isArray(imagesData)
      ? imagesData
      : [];

    // Fetch ratings with Authorization header
    const ratingsResponse = await fetch("http://localhost:3000/api/v1/ratings", {
      headers: {
        Authorization: "Bearer pankix",
      },
    });

    const ratingsData = await ratingsResponse.json();

    // Calculate average rating and rating count for each hotel
    return hotels.map((hotel) => {
      // Filter ratings for the current hotel
      const hotelRatings = ratingsData.filter(
        (rating: { hotel_id: number }) => rating.hotel_id === hotel.id
      );

      // Calculate the average rating and count
      const totalRatings = hotelRatings.length;
      const averageRating =
        totalRatings > 0
          ? hotelRatings.reduce((sum: number, rating: { rating: number }) => sum + rating.rating, 0) / totalRatings
          : 0;

      const matchingImage = images.find((img) => img.id === hotel.id);
      return {
        ...hotel,
        thumb: matchingImage ? matchingImage.thumb : "", // Default to empty string if no image found
        averageRating, // Set average rating
        ratingCount: totalRatings, // Set rating count
      };
    });
  } catch (error) {
    console.error("Error fetching hotels, images, or ratings:", error);
    return [];
  }
};

const styles = {
  hotelList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    justifyContent: "center",
    padding: "20px",
  } as React.CSSProperties,

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

const hoverColor = "#0056b3"; // For button hover effect

// Hotel card component
const HotelCard: React.FC<{ hotel: Hotel }> = ({ hotel }) => {
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
      {hotel.thumb && (
        <img
          src={hotel.thumb}
          alt={hotel.name}
          loading="lazy"
          style={{
            width: "100%",
            height: "150px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      )}
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

      <button
        style={styles.hotelButton}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.hotelButton.backgroundColor as string)}
      >
        See Details
      </button>
    </div>
  );
};

// Hotel list component
const HotelList: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    fetchHotels().then(setHotels);
  }, []);

  return (
    <div style={styles.hotelList}>
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
};

export default HotelList;
