import db from "./db";

export async function getBookings() {
  const res = await db.select("SELECT * FROM bookings limit 30");
  return res;
}
