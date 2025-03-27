import db from "./db";

export async function getAmenities(hotelId: number): Promise<Amenity[]> {
  return await db.select(
    "select id, amenity, img from hotelamenities inner join amenities on amenity_id = amenities.id where hotel_id = ?",
    hotelId
  );
}
