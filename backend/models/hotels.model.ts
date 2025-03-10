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

  return await Promise.all(
    hotels.map(async (hotel) => {
      const { avg, count } = await db.selectOne<{ avg: string; count: number }>(
        "select count(*) as 'count', avg(rating) as 'avg' from ratings where hotel_id = ?",
        [hotel.id]
      );
      return { ...hotel, rating: { avg: parseFloat(avg), count } };
    })
  );
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
    "select avg(rating) as 'avg', count(*) as 'count' from ratings where hotel_id = ?",
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
