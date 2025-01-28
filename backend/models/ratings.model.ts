import db from "./db";

export async function getRatings() {
  const res = await db.select("SELECT * FROM ratings limit 1000");
  return res;
}
