import db from "./db";

export async function getImages() {
  return await db.select("SELECT id, full FROM images");
}

export async function delImage(id: number) {
  const hotelId = await db.selectOne(
    "SELECT hotelId FROM images WHERE id = ?",
    id
  );
  await db.delete("DELETE FROM hotels WHERE id = ?", hotelId);
}
