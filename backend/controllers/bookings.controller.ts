import { getBookings } from "../models/bookings.model";

export default {
  getBookings: async (req: any, res: any) => {
    try {
      const bookings = await getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings", error });
    }
  },
};
