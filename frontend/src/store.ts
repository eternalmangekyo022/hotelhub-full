import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const savedFavorites = localStorage
  .getItem("hotelhub-fav")
  ?.split(",")
  .map(Number);

export const favoritesAtom = atomWithStorage<number[]>(
  "favorites",
  savedFavorites || [],
);

export const selectedHotelAtom = atom<Hotel | null>(null);
export const geoAtom = atom<{ lat: number; lon: number }>({ lat: 0, lon: 0 });

export const sortByAtom = atom<ISortBy>("");
export const hotelsAtom = atom<Hotel[]>([]);
export const userAtom = atom<User | null>(null);