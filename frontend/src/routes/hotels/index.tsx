import { useEffect } from "react";
import HotelCard from "../../components/HotelCard.tsx";
import Find from "../../components/Find.tsx";

import { getHotels } from "../../hooks/useHotels.ts";

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { useAtom } from "jotai";
import {
  searchQueryAtom,
  sortByAtom,
  pageAtom,
  hotelsAtom,
} from "../../store.ts";

import "../styles/hotels.scss";
import HouseSvg from "../../components/HouseSvg.tsx";
import HotelSignSvg from "../../components/HotelSignSvg.tsx";
import HotelHangingSignSvg from "../../components/HotelHangingSignSvg.tsx";
import FourStarsSvg from "../../components/FourStars.tsx";
import BellSvg from "../../components/BellSvg.tsx";
import BedSvg from "../../components/BedSvg.tsx";
import HousesSvg from "../../components/HousesSvg.tsx";
import Dog from "../../components/Dog.tsx";

export const Route = createFileRoute("/hotels/")({
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
    refetchOnMount: !mutatedHotels.length,
  });
  const loaders = [
    HouseSvg,
    HotelSignSvg,
    HotelHangingSignSvg,
    FourStarsSvg,
    BellSvg,
    BedSvg,
    HousesSvg,
    Dog,
  ];

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
          return a.rating.avg - b.rating.avg;
        case "rating-desc":
          return b.rating.avg - a.rating.avg;
        case "ratingtotal-asc":
          return a.rating.count - b.rating.count;
        case "ratingtotal-desc":
          return b.rating.count - a.rating.count;
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
    if (!entries) return;
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
    if (!toObserve) return;
    observer.observe(toObserve);

    return () => {
      observer.unobserve(hotelCards[dividable[dividable.length - 1]]);
    };
  }, [mutatedHotels]);

  return (
    <>
      <Find />
      <div className="hotel-list">
        {mutatedHotels.map((hotel, idx) => {
          const Loader = loaders[Math.floor(loaders.length * Math.random())];
          return (
            <HotelCard idx={idx} key={hotel.id} hotel={hotel} Loader={Loader} />
          );
        })}
      </div>
    </>
  );
}
