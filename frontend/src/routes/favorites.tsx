import { Link, createFileRoute } from "@tanstack/react-router";
import "./styles/favorites.scss";
import { useAtom } from "jotai";
import { favoritesAtom } from "../store.ts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/favorites")({
  component: Favorites,
});

export default function Favorites() {
  const [favorites, setFavorites] = useAtom(favoritesAtom);

  const { data: loaded = [], isFetching } = useQuery<Hotel[]>({
    queryKey: ["favorites", favorites], // Use array instead of joined string
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!favorites.length) return [];
      try {
        const hotelRequests = favorites.map((id) =>
          axios.get<Hotel>(`http://localhost:3000/api/v1/hotels/id/${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer pankix",
            },
          })
        );
        const responses = await Promise.all(hotelRequests);
        return responses.map((res) => res.data);
      } catch (error) {
        console.error("Error fetching favorite hotels:", error);
        return [];
      }
    },
    enabled: favorites.length > 0,
  });

  return (
    <div className="favorites-page">
      <h1>Your Favorites</h1>
      <div className="favorites-items">
        {loaded.length > 0 ? (
          loaded.map((item) => (
            <div key={item.id} className="favorites-item">
              <img
                src={item.images[0]?.full}
                alt={item.name}
                className="item-image"
              />
              <div className="item-details">
                <h2>{item.name}</h2>
                <p>{item.city}</p>
                <p><span className="price">${item.price}</span> / night</p>
                <button
                  className="remove-button"
                  onClick={() =>
                    setFavorites((prev) => prev.filter((id) => id !== item.id))
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>
            Your list is empty. <Link to="/Hotels">Explore hotels</Link> to add
            items to your favorites.
          </p>
        )}
      </div>
    </div>
  );
}
