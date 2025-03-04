import { getAmenities } from "../models/amenities.model";

export default {
  getAmenities: async (req: any, res: any) => {
    try {
      const amenities = await getAmenities();
      res.json(amenities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching amenities", error });
    }
  },
};
