import db from "./db";

export async function getBookings() {
  const res = await db.select("SELECT * FROM bookings limit 30");
  return res;
}

export async function getBookingsById(id: number) {
  const res = await db.select("SELECT * FROM bookings WHERE user_id = ?", id);
  return res;
}

export async function addBooking(bookingData: Booking) {
  const res = await db.insert("INSERT INTO bookings SET ?", bookingData);
  return res;
}

export async function updateRating(bookingId: number, rating: number) {
  const res = await db.update("UPDATE bookings SET rating = ? WHERE id = ?", [rating, bookingId]);
  return res;
}