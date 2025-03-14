import { getAmenities } from "../models/amenities.model";

export default {
  getAmenities: async ({ params: { hotelId } }: any, res: any) => {
    try {
      const amenities = await getAmenities(hotelId);
      res.json(amenities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching amenities", error });
    }
  },
};
