import { useEffect, useState } from "react";
import HotelCard from "../../components/HotelCard.tsx";
import Find from "../../components/Find.tsx";

import { getHotels } from "../../hooks/useHotels.ts";

import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from 'react-hook-form'

import { useAtom } from "jotai";
import {
  sortByAtom,
  pageAtom,
} from "@store";

import "../styles/hotels.scss";

export const Route = createFileRoute("/hotels/")({
  component: Hotels,
});

function Hotels() {
  const [sortBy] = useAtom(sortByAtom);
  const [page, setPage] = useAtom(pageAtom);
  const queryClient = useQueryClient();

  function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const timeout = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(timeout);
    }, [value]);
    return debouncedValue;
  }

  const { register, handleSubmit: formHandleSubmit, setValue, watch } = useForm<{
    location: string;
    price: number[];
    rating: number[];
    searchQuery: string;
    payment: {
      card: boolean;
      cash: boolean;
    };
  }>({
    mode: "onChange",
    defaultValues: {
      location: "",
      price: [1, 1000],
      rating: [1, 5],
      searchQuery: "",
      payment: {
        card: true,
        cash: true
      },
    },
  });

  useEffect(() => {
    console.log(page)
  }, [page]);

  const search = useDebounce(watch("searchQuery"), 700);
  const payment = watch("payment");
  const location = useDebounce(watch("location"), 700);
  const price = watch("price");
  const rating = watch("rating");

  // Main query for fetching hotels with pagination
  const { isFetching } = useQuery<Hotel[]>({
    queryKey: ["hotels", "infinite", page, sortBy, search, payment.card, payment.cash, location, price, rating],
    queryFn: async () => {
      const response = await getHotels({ 
        offset: (page - 1),
        location, 
        price, 
        payment, 
        rating, 
        searchQuery: search, 
        sortBy 
      });
      
      // Update the cache with new results
      queryClient.setQueryData<Hotel[]>(
        ["hotels", "all"],
        (old = []) => {
          if (page === 1) return response;
          return [...old, ...response].filter((hotel, index, self) =>
            index === self.findIndex((h) => h.id === hotel.id)
          );
        }
      );
      return response;
    }
  });

  // Effect to reset page when filters change
  useEffect(() => {
    setPage(1);
    queryClient.invalidateQueries({ queryKey: ["hotels", "all"] });
  }, [sortBy, search, payment.card, payment.cash, location, price, rating]);

  // Get the merged hotels data from cache
  const hotels = queryClient.getQueryData<Hotel[]>(["hotels", "all"]) || [];

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
    if (!hotels.length) return;
    const hotelCards = document.querySelectorAll(".hotel-card");
    const dividable: number[] = [];

    for (let i = 0; i < hotelCards.length; i++)
      if ((i + 1) % 20 === 0) dividable.push(i);

    const toObserve = hotelCards[dividable[dividable.length - 1]];
    if (!toObserve) return;
    observer.observe(toObserve);

    return () => {
      if (toObserve) observer.unobserve(toObserve);
    };
  }, [hotels]);

  return (
    <>
      <Find 
        refetch={() => queryClient.invalidateQueries({ queryKey: ["hotels"] })} 
        register={register} 
        handleSubmit={formHandleSubmit} 
        setValue={setValue} 
      />
      <div className="hotel-list">
        {hotels.map((hotel, idx) => (
          <HotelCard idx={idx} key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </>
  );
}