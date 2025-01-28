import { getRatings } from "../models/ratings.model";

export default {
  getRatings: async (req: any, res: any) => {
    try {
      const ratings = await getRatings();
      res.json(ratings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching ratings", error });
    }
  },
};
