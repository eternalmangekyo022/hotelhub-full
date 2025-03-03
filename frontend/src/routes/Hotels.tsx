import { useEffect } from "react";
import HotelCard from "../components/HotelCard.tsx";
import Find from "../components/Find.tsx";

import { getHotels } from "../hooks/useHotels.ts";

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { useAtom } from "jotai";
import { searchQueryAtom, sortByAtom, pageAtom, hotelsAtom } from "../store.ts";

import "./styles/hotels.scss";

export const Route = createFileRoute("/Hotels")({
  component: Hotels,
});

function Hotels() {
  const [searchQuery] = useAtom(searchQueryAtom);
  const [sortBy] = useAtom(sortByAtom);
  const [page, setPage] = useAtom(pageAtom);
  const [mutatedHotels, setMutatedHotels] = useAtom(hotelsAtom);
  const { data: hotels, isFetching } = useQuery({
    queryKey: ["hotels", page],
    queryFn: async () => {
      const response = await getHotels(page - 1);
      setMutatedHotels((prev) => [...prev, ...response]);
      return response;
    },
    initialData: [],
    refetchOnWindowFocus: false,
    refetchOnMount: !mutatedHotels.length,
  });

  useEffect(() => {
    if (!hotels.length) return;

    const filtered =
      searchQuery.trim() === ""
        ? mutatedHotels
        : mutatedHotels.filter((hotel) =>
            hotel.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

    const sortedHotels = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "rating-asc":
          return a.averageRating - b.averageRating;
        case "rating-desc":
          return b.averageRating - a.averageRating;
        case "ratingtotal-asc":
          return a.ratingCount - b.ratingCount;
        case "ratingtotal-desc":
          return b.ratingCount - a.ratingCount;
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setMutatedHotels(sortedHotels);
  }, [sortBy, searchQuery, hotels]);

  const observe: IntersectionObserverCallback = (entries) => {
    if (!entries) return
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isFetching) {
        setPage((prev) => prev + 1);
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observe, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  });

  useEffect(() => {
    if (!mutatedHotels.length) return;
    const hotelCards = document.querySelectorAll(".hotel-card");
    const dividable: number[] = [];

    for (let i = 0; i < hotelCards.length; i++)
      if ((i + 1) % 20 === 0) dividable.push(i);

    const toObserve = hotelCards[dividable[dividable.length - 1]];
    if (!toObserve) return
    observer.observe(toObserve);

    return () => {
      observer.unobserve(hotelCards[dividable[dividable.length - 1]]);
    };
  }, [mutatedHotels]);

  return (
    <>
      <Find />
      <div className="hotel-list">
        {mutatedHotels.map((hotel, idx) => (
          <HotelCard idx={idx} key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </>
  );
}
