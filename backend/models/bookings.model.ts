import db from "./db";

export async function getBookings() {
  const res = await db.select("SELECT * FROM bookings limit 30");
  return res;
}

export async function getBookingsById(id: number) {
  const res = await db.select("SELECT * FROM bookings WHERE user_id = ?", id);
  return res;
}

export async function addBooking(bookingData: {
  user_id: number;
  hotel_id: number;
  booked: string;
  checkin: string;
  checkout: string;
  payment_id: number;
  participants: number;
  rating: number;
}) {
  const res = await db.insert("INSERT INTO bookings SET ?", bookingData);
  return res;
}

