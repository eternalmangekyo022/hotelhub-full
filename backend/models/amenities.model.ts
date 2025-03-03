import db from "./db";

export async function getAmenities() {
  const res = await db.select("SELECT hotel_id AS hotel, amenities.amenity AS amenity FROM hotelamenities JOIN amenities ON hotelamenities.amenity_id = amenities.id;");
  return res;
}
