import Arrow from "/vectors/arrow-up-right.svg";
import Trash from "/vectors/trash.svg";
import { useState } from "react";
import { favoritesAtom } from "@store";
import { useSetAtom } from "jotai";

interface Props {
  hotel: Hotel;
}

export default function FavoriteCard({
  hotel: { images, description, name, id },
}: Props) {
  const setFavorites = useSetAtom(favoritesAtom);
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="du-card h-96 bg-base-200 w-96 shadow-sm rounded-md">
      <figure className="h-[55%]">
        <img
          src={`/images/full/${images[0].full}`}
          alt="Shoes"
          onLoad={() => setLoaded(true)}
          style={{ display: loaded ? "inline" : "none" }}
        />
        {!loaded && (
          <div className="flex w-full h-full flex-col">
            <div className="du-skeleton h-full w-full rounded-none"></div>
          </div>
        )}
      </figure>
      <div className="du-card-body p-4 h-[45%] not-dark:">
        <h2 className="du-card-title not-dark:text-white">{name}</h2>
        <p style={{ lineHeight: "1.3rem" }}>{description}</p>
        <div className="du-card-actions justify-between">
          <button
            onClick={() => setFavorites((prev) => prev.filter((i) => i !== id))}
            className="du-btn du-btn-error p-0 m-0 w-10 h-10"
          >
            <img src={Trash} alt="trash" className="w-6" />
          </button>
          <button className="du-btn du-btn-info">
            View Details
            <img src={Arrow} alt="" className="inline w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
