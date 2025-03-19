import { getBookings, getBookingsById, addBooking } from "../models/bookings.model";

export default {
  getBookings: async (req: any, res: any) => {
    try {
      const bookings = await getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings", error });
    }
  },
  getBookingsById: async (req: any, res: any) => {
    try {
      const id = req.params.id;
      const booking = await getBookingsById(id);
      res.json(booking);
      } catch (error) {
      res.status(500).json({ message: "Error fetching booking", error });
    }
  },
addBooking: async (req: any, res: any) => {
    try {
      const bookingData = req.body;
      const newBooking = await addBooking(bookingData);
      res.status(201).json(newBooking);
    } catch (error) {
      res.status(500).json({ message: "Error adding booking", error });
    }
  },
};

