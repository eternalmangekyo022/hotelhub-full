import db from "./db";

export async function getHotels(offset: string) {
  let hotels = (
    await db.select<Hotel>(
      "SELECT * FROM hotels limit 30 offset ?",
      parseInt(offset)
    )
  ).map((h) => ({ ...h, images: [] as Image[] }));

  const ids = hotels.map((hotel) => hotel.id).join(",");
  const images = await db.select<{
    id: number;
    hotel_id: number;
    thumb: string;
    full: string;
  }>(`select * from images where hotel_id in (${ids})`);

  for (let i = 0; i < hotels.length; i++) {
    for (let j = 0; j < images.length; j++) {
      if (hotels[i].id === images[j].hotel_id) {
        hotels[i].images.push({ thumb: images[j].thumb, full: images[j].full });
      }
    }
  }
  const toGet = hotels.map((i) => i.id).join(",");
  const q = `select hotel_id, avg(rating) AS "avg", count(rating) as "count" from bookings where hotel_id in (${toGet}) group BY hotel_id`;
  const ratings = await db.select<{ avg: string; count: number }>(q);

  let final: Hotel[] = [];

  for (let i = 0; i < ratings.length; i++) {
    final = [
      ...final,
      {
        ...hotels[i],
        rating: { avg: parseFloat(ratings[i].avg), count: ratings[i].count },
      },
    ];
  }
  return final;
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
    "select avg(rating) as 'avg', count(*) as 'count' from bookings group by hotel_id where hotel_id = ?",
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
  return hotels;
}

export async function getHotelsFiltered(
  query: Partial<
    Omit<Hotel, "id" | "price" | "images" | "description"> & {
      minPrice: string;
      maxPrice: string;
      limit: string;
      offset: string;
    }
  >
) {
  const numbers = "id,minPrice,maxPrice,owner_id,x,y,class,capacity".split(",");
  const toSearch = Object.entries(query)
    .filter(([k]) => !["maxPrice", "minPrice", "limit", "offset"].includes(k))
    .map(([k, v]) => `${k} = ${numbers.includes(k) ? v : `'${v}'`}`)
    .join(" and ");

  let priceFilter = "";

  if (query.maxPrice || query.minPrice) {
    let {
      minPrice: minimum,
      maxPrice: maximum,
    }: { minPrice?: string | number; maxPrice?: string | number } = query;
    [minimum, maximum] = [minimum, maximum].map((p) =>
      p === undefined ? undefined : Number(p)
    );
    if (minimum !== undefined && maximum !== undefined) {
      priceFilter = `${
        priceFilter || toSearch ? " and " : ""
      }price between ${Math.min(minimum, maximum)} and ${Math.max(
        minimum,
        maximum
      )}`;
    } else if (minimum !== undefined) {
      priceFilter = `${
        priceFilter || toSearch ? " and " : ""
      }price >= ${minimum}`;
    } else if (maximum !== undefined) {
      priceFilter = `${
        priceFilter || toSearch ? " and " : ""
      }price <= ${maximum}`;
    }
  }
  const searchQuery = `SELECT * FROM hotels where ${toSearch}${priceFilter} limit ${
    Number(query.limit) || 30
  } offset ${Number(query.offset) || 0}`;

  return await db.select<Hotel>(searchQuery);
}

//https://api.geoapify.com/v1/geocode/search?text=Barcelona%20Spain&format=json&apiKey=1679f7cee64a411a929232a6cf0e4987

export async function getClosestHotels(location: string) {
  const [lat, lon] = location.split(",").map((i) => parseFloat(i));
}
