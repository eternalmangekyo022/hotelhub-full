import { getHotels } from "../models/hotels.model";

export default {
  getHotels: async ({ query: { offset } }: any, res: any) => {
    const hotels = await getHotels(offset || "0");
    res.json(hotels);
  },
};
