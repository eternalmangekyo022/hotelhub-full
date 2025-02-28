import { getHotels, getHotelById, getHotelsById } from "../models/hotels.model";

export default {
  getHotels: async ({ query: { offset } }: any, res: any) => {
    const hotels = await getHotels(offset || "0");
    res.json(hotels);
  },
  getHotelById: async ({ params: { id } }: any, res: any) => {
    const hotel = await getHotelById(id);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    res.json(hotel);
  },
  getHotelsById: async (
    { query: { ids } }: { query: { ids: `^\d+(,\d+)*$` } },
    res: any
  ) => {
    const hotels = await getHotelsById(ids.split(",").map(Number));
    res.json(hotels);
  },
};
