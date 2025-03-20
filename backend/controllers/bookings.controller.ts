import { getBookings, getBookingsById, addBooking, updateRating } from "../models/bookings.model";

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
  updateRating: async (req: any, res: any) => {
    try {
      const bookingId = parseInt(req.params.bookingid, 10);
      if (isNaN(bookingId)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      const { rating } = req.body;
      if (typeof rating !== 'number') {
        return res.status(400).json({ message: "Rating must be a number" });
      }
      const result = await updateRating(bookingId, rating);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json({ message: "Rating updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating rating", error });
    }
  },
  
};
