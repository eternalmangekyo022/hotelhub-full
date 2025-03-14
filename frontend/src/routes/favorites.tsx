import { Link, createFileRoute } from "@tanstack/react-router";
import "./styles/favorites.scss";
import { useAtom } from "jotai";
import { favoritesAtom } from "../store.ts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FavoriteCard from "../components/FavoriteCard.tsx";

export const Route = createFileRoute("/favorites")({
  component: Favorites,
});

export default function Favorites() {
  const [favorites, setFavorites] = useAtom(favoritesAtom);

  const { data: loaded } = useQuery<Hotel[]>({
    queryKey: ["favorites", favorites], // Use array instead of joined string
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
    initialData: [],
    enabled: favorites.length > 0,
  });

  return (
    <div className="favorites-page">
      <h1 className="dark:text-white">Your Favorites</h1>
      <div className="favorites-items">
        {loaded.length > 0 ? (
          loaded.map((hotel) => <FavoriteCard hotel={hotel} key={hotel.id} />)
        ) : (
          <p>
            Your list is empty. <Link to="/hotels">Explore hotels</Link> to add
            items to your favorites.
          </p>
        )}
      </div>
      {favorites.length > 2 && (
        <button className="remove-all" onClick={() => setFavorites([])}>
          Remove all
        </button>
      )}
    </div>
  );
}
