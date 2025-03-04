import db from "./db";

export async function getAmenities(hotelId: number) {
  return await db.select(
    "select amenity from hotelamenities inner join amenities on amenity_id = amenities.id where hotel_id = ?",
    hotelId
  );
}
