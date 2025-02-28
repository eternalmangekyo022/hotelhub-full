import { Link } from "@tanstack/react-router";
import "./styles/wishlist.scss";
import { useAtom } from "jotai";
import { favoritesAtom } from "../store.ts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Wishlist = () => {
  const [favorites, setFavorites] = useAtom(favoritesAtom);

  const { data: loaded } = useQuery<unknown, unknown, Hotel[]>({
    queryKey: ["favorites", favorites.join(",")],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return await axios.get(
        `/api/v1/hotels/unison?ids=${favorites.join(",")}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    enabled: !!favorites.length,
    initialData: [],
  });

  return (
    <div className="wishlist-page">
      <h1>Your Wishlist</h1>
      <div className="wishlist-items">
        {loaded.length > 0 ? (
          loaded.map((item) => (
            <div key={item.id} className="wishlist-item">
              <img
                src={item.images[0]?.full}
                alt={item.name}
                className="item-image"
              />
              <div className="item-details">
                <h2>{item.name}</h2>
                <p>{item.city}</p>
                <p>${item.price} per night</p>
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
            Your wishlist is empty. <Link to="/Hotels">Explore hotels</Link> to
            add items to your wishlist.
          </p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
