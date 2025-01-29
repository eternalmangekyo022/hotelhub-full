import axios from "axios";

export async function getHotels(): Promise<Hotel[]> {
  try {
    // Fetch hotels
    const { data: hotels } = await axios.get<Hotel[]>(
      "http://localhost:3000/api/v1/hotels",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Fetch images with Authorization header
    const { data: imagesData } = await axios.get(
      "http://localhost:3000/api/v1/images",
      {
        headers: {
          Authorization: "Bearer pankix",
          "Content-Type": "application/json",
        },
      }
    );

    const images: { id: number; thumb: string }[] = Array.isArray(imagesData)
      ? imagesData
      : [];

    // Fetch ratings with Authorization header
    const { data: ratingsData } = await axios.get(
      "http://localhost:3000/api/v1/ratings",
      {
        headers: {
          Authorization: "Bearer pankix",
          "Content-Type": "application/json",
        },
      }
    );

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
          ? hotelRatings.reduce(
              (sum: number, rating: { rating: number }) => sum + rating.rating,
              0
            ) / totalRatings
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
}
