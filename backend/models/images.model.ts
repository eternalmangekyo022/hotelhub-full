import db from "./db";

export async function getImages() {
  return await db.select("SELECT id, thumb, hotel_id FROM images");
}
