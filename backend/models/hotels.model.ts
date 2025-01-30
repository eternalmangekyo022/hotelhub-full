import db from "./db";

export async function getHotels(offset = 0) {
  const res = await db.select("SELECT * FROM hotels", offset);
  return res;
}
