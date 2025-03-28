import {
  getHotels,
  getHotelById,
  getHotelsById,
  getPriceRange,
  type SortTypes
} from "../models/hotels.model"
import { type Request } from 'express';

interface HotelQueryParams {
  offset?: string;
  searchQuery?: string;
  sortBy?: `${SortTypes["sortBy"]}-${"asc" | "desc"}`;
  location?: string;
  price?: string;
  payment?: string;
  rating?: string;
}

export default {
  getHotels: async (req: Request<{}, {}, {}, HotelQueryParams>, res: Res) => {
    try {
      // Extract all query parameters
      const {
        offset = "0",
        searchQuery,
        sortBy,
        location,
        price,
        payment,
        rating
      } = req.query;

      // Call the model function with all filters
      const hotels = await getHotels({
        offset,
        searchQuery,
        sortBy: sortBy as `${SortTypes["sortBy"]}-${"asc" | "desc"}`,
        location,
        price,
        payment,
        rating
      });

      res.json(hotels);
    } catch (error) {
      console.error('Error in hotels controller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
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
    const splitIds = ids.split(",").map(Number);
    const hotels = await getHotelsById(splitIds);
    res.json(hotels);
  },
  getPriceRange: async (req: any, res: any) => {
    const range = await getPriceRange();
    res.json(range);
  },
};
