import db from "./db";

export async function getHotels(offset = 0) {
  const res = await db.select("SELECT * FROM hotels limit 1 offset ?", offset);
  return res;
}
