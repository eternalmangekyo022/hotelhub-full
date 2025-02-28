import { atom } from "jotai";

const savedFavorites = localStorage.getItem("hotelhub-fav");

export const favoritesAtom = atom<number[]>(
  savedFavorites ? savedFavorites.split(",").map(Number) : []
);

export const selectedHotelAtom = atom<Hotel | null>(null);
