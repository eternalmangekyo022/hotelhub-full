import db from "./db";

export async function getHotels(offset: string) {
  let hotels = await db.select<Hotel>(
    "SELECT * FROM hotels limit 20 offset ?",
    parseInt(offset)
  );

  const ids = hotels.map((hotel) => hotel.id).join(",");
  const images = await db.select<{
    id: number;
    hotel_id: number;
    thumb: string;
    full: string;
  }>(`select * from images where hotel_id in (${ids})`);

  hotels = hotels.map((h) => ({ ...h, images: [] }));

  for (let i = 0; i < hotels.length; i++) {
    for (let j = 0; j < images.length; j++) {
      if (hotels[i].id === images[j].hotel_id) {
        hotels[i].images.push({ thumb: images[j].thumb, full: images[j].full });
      }
    }
  }

  return hotels;
}
