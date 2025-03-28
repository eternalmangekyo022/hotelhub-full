import db from "./db";

function transformURI(search: string, property: string) {
  return `${property} LIKE '%${search}%'`
}

export interface SortTypes {
  sortBy: "reviews" | "rating" | "price";
}

export async function getHotels(filter: {
  offset?: string;
  searchQuery?: string;
  sortBy?: `${SortTypes["sortBy"]}-${"asc" | "desc"}`;
  location?: string;
  price?: string;
  payment?: string;
  rating?: string;
}) {
  try {
    // Parse filter parameters
    const offset = parseInt(filter.offset || '0', 10);
    const { location: hotelLocation, price: priceParam, payment, searchQuery: search, rating: ratingParam } = filter;
    // Parse ranges

    const [priceMin, priceMax] = priceParam?.split('-').map(Number) || [];
    const [ratingMin, ratingMax] = ratingParam?.split('-').map(Number) || [];

    // Build conditions
    const conditions: string[] = [];

    if (search) {
      const searches = decodeURI(search).split(' ').map((i) => transformURI(i, "h.name"));
      conditions.push(searches.join(" AND "));
    }

    if (hotelLocation) {
      const locations = decodeURI(hotelLocation).split(' ').map(i => transformURI(i, "h.city"));
      conditions.push(locations.join(" AND "));
    }

    const params: any[] = [];

    // Price filter
    if (!isNaN(priceMin) && !isNaN(priceMax)) {
      conditions.push('h.price BETWEEN ? AND ?');
      params.push(priceMin, priceMax);
    }

    // Payment filter (more flexible version)
    if (payment) {
      conditions.push(`h.payment_id = ${payment.includes("card") ? 2 : payment.includes("cash") ? 1 : 3}`);
    }

    // Rating filter (more inclusive version)
    if (!isNaN(ratingMin) && !isNaN(ratingMax)) {
      conditions.push('(r.avg_rating IS NULL OR r.avg_rating BETWEEN ? AND ?)');
      params.push(ratingMin, ratingMax);
    }

    let orderBy = 'h.id ASC';
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'price-asc':
          orderBy = 'h.price ASC';
          break;
        case 'price-desc':
          orderBy = 'h.price DESC';
          break;
        case 'rating-asc':
          orderBy = 'COALESCE(r.avg_rating, 0) ASC';
          break;
        case 'rating-desc':
          orderBy = 'COALESCE(r.avg_rating, 0) DESC';
          break;
        case 'reviews-asc':
          orderBy = 'COALESCE(r.rating_count, 0) ASC';
          break;
        case 'reviews-desc':
          orderBy = 'COALESCE(r.rating_count, 0) DESC';
          break;
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
      SELECT 
        h.*, 
        COALESCE(r.avg_rating, 0) AS avg_rating,
        COALESCE(r.rating_count, 0) AS rating_count
      FROM hotels h
      LEFT JOIN (
        SELECT hotel_id, AVG(rating) AS avg_rating, COUNT(rating) AS rating_count
        FROM bookings
        WHERE rating > 0
        GROUP BY hotel_id
      ) r ON h.id = r.hotel_id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT 30 OFFSET ?
    `;

    params.push(offset);

    // Execute query
    const hotels = await db.select<Hotel & { avg_rating: number; rating_count: number }>(query, params);

    // Fetch images if we got hotels
    if (hotels.length > 0) {
      const ids = hotels.map(h => h.id);
      const images = await db.select<Image & { hotel_id: number }>(
        `SELECT * FROM images WHERE hotel_id IN (?)`,
        [ids]
      );

      // Attach images
      hotels.forEach(hotel => {
        hotel.images = images
          .filter(img => img.hotel_id === hotel.id)
          .map(img => ({ thumb: img.thumb, full: img.full }));
      });
    }

    // Transform the results
    const result = hotels.map(hotel => ({
      ...hotel,
      rating: {
        count: hotel.rating_count,
        avg: hotel.avg_rating
      },
      payment: hotel.payment_id === 1 ? 'cash' :
        hotel.payment_id === 2 ? 'card' : 'both'
    }));

    return result;

  } catch (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
}

export async function getHotelById(id: string) {
  const hotel = await db.selectOne<Hotel>("SELECT * FROM hotels WHERE id = ?", [
    id,
  ]);

  if (!hotel) return null;

  const images = await db.select<{
    id: number;
    hotel_id: number;
    thumb: string;
    full: string;
  }>("SELECT * FROM images WHERE hotel_id = ?", [id]);

  const { avg, count } = await db.selectOne<{ avg: string; count: number }>(
    "select avg(rating) as 'avg', count(*) as 'count' from bookings where hotel_id = ? group by hotel_id",
    [id]
  );

  return {
    ...hotel,
    images,
    rating: { avg: parseFloat(avg), count },
  } satisfies Hotel;
}

export async function getHotelsById(ids: number[]) {
  const hotels = await db.select<Hotel>(
    "SELECT * FROM hotels WHERE id in (?)",
    [ids]
  );
  if (hotels.length !== ids.length) throw { status: 404, message: "Not found" }
  return hotels;
}

//https://api.geoapify.com/v1/geocode/search?text=Barcelona%20Spain&format=json&apiKey=1679f7cee64a411a929232a6cf0e4987

export async function getClosestHotels(location: string) {
  const [lat, lon] = location.split(",").map((i) => parseFloat(i));
}

export async function getPriceRange() {
  const { price: minPrice } = await db.selectOne<{ price: number }>("select price from hotels order by price asc limit 1");
  const { price: maxPrice } = await db.selectOne<{ price: number }>("select price from hotels order by price desc limit 1");

  return { price: { min: minPrice, max: maxPrice } };
}