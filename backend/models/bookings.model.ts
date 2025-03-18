import db from "./db";

export async function getBookings() {
  const res = await db.select("SELECT * FROM bookings limit 30");
  return res;
}

export async function getBookingsById(id: number) {
  const res = await db.select("SELECT * FROM bookings WHERE user_id = ?", id);
  return res;
}