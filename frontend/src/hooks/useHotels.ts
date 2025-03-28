import axios from "axios";

export async function getHotels(filter: { offset: number, searchQuery?: string, sortBy?: string, location?: string, price?: [number, number], payment?: { card: boolean, cash: boolean }, rating?: [number, number] }): Promise<Hotel[]> {
  try {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(filter)) {
      if (value === undefined || value === null || value === "") continue;
      switch (key) {
        case "offset":
          params.append(key, (value as number).toString());
          break;
        case "price":
          params.append(key, (value as [number, number])[0].toString() + "-" + (value as [number, number])[1].toString());
          break;
        case "rating":
          if ((value as [number, number])[0] === 1 && (value as [number, number])[1] === 5) break;
          params.append(key, (value as [number, number])[0] === 1 && (value as [number, number])[1] === 5 ? "" : (value as [number, number])[0].toString() + "-" + (value as [number, number])[1].toString());
          break;
        case "payment":
          if (!(value as { card: boolean; cash: boolean }).card && !(value as { card: boolean; cash: boolean }).cash) break;
          params.append(key, (value as { card: boolean; cash: boolean }).card && (value as { card: boolean; cash: boolean }).cash
            ? "both"
            : (value as { card: boolean; cash: boolean }).card
              ? "card"
              : (value as { card: boolean; cash: boolean }).cash
                ? "cash"
                : "");
          break;
        default:
          params.append(key, (value as string));
      }
    }

    const { data: hotels } = await axios.get<Hotel[]>(
      "http://localhost:3000/api/v1/hotels",
      {
        headers: {
          "Content-Type": "application/json",
        },
        params,
      },
    );

    return hotels;
  } catch (error) {
    console.error("Error fetching hotels, images, or bookings:", error);
    return [];
  }
}
