import axios from "axios";

export async function getHotels(filter: { offset: number, searchQuery?: string, sortBy?: string, location?: string, price?: number[], payment?: { card: boolean, cash: boolean }, rating?: number[] }): Promise<Hotel[]> {
  try {
    // Fetch hotels
    const { data: hotels } = await axios.get<Hotel[]>(
      `http://localhost:3000/api/v1/hotels?${Object.entries(filter)
        .map(([key, value]) => {
          if (value === undefined || value === null || value === "" || (key === "rating" && (value as number[]).filter((i, idx) => (idx === 0 && i === 1) || (idx === 1 && i === 5)).length === 2)) return "";
          switch (key) {
            case "offset":
              return `offset=${(value as number) * 30}`;
            case "price":
            case "rating":
              return `${key}=${(value as number[])[0]}-${(value as number[])[1]}`;
            case "payment":
              return (value as { card: boolean; cash: boolean }).card && (value as { card: boolean; cash: boolean }).cash
                ? "payment=both"
                : (value as { card: boolean; cash: boolean }).card
                ? "payment=card"
                : (value as { card: boolean; cash: boolean }).cash
                ? "payment=cash"
                : "payment=both";
            default:
              return `${key}=${(value as string)}`;
          }
        }).filter(i => i !== "")
        .join("&")}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return hotels;
  } catch (error) {
    console.error("Error fetching hotels, images, or bookings:", error);
    return [];
  }
}
