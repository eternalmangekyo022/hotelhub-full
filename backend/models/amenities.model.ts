import db from "./db";

export async function getAmenities() {
  const res = await db.select("SELECT hotels.name AS hotel, amenities.amenity AS amenity FROM hotelamenities JOIN hotels ON hotelamenities.hotel_id = hotels.id JOIN amenities ON hotelamenities.amenity_id = amenities.id;");
  return res;
}
