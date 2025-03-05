import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils';

const savedFavorites = localStorage.getItem("hotelhub-fav");

export const favoritesAtom = atomWithStorage<number[]>('favorites', []);

export const selectedHotelAtom = atom<Hotel | null>(null);

export const sortByAtom = atom<ISortBy>("");
export const searchQueryAtom = atom("");
export const pageAtom = atom<number>(1);
export const hotelsAtom = atom<Hotel[]>([]);
