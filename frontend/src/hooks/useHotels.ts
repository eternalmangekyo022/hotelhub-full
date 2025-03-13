import axios from "axios";

export async function getHotels(offset: number = 0): Promise<Hotel[]> {
  try {
    // Fetch hotels
    const { data: hotels } = await axios.get<Hotel[]>(
      `http://localhost:3000/api/v1/hotels?offset=${offset * 30}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return hotels;
  } catch (error) {
    console.error("Error fetching hotels, images, or bookings:", error);
    return [];
  }
}
