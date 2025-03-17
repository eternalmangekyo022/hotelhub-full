import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { selectedHotelAtom } from "@store";
import { useAtom } from "jotai";

export const Route = createFileRoute("/hotels/$hotelId")({
  component: RouteComponent,
});

function RouteComponent() {
  const [selected] = useAtom(selectedHotelAtom);
  const { hotelId } = useParams({ from: "/hotels/$hotelId" });
  const { data: hotel } = useQuery<Hotel>({
    queryKey: ["selectedHotel"],
    async queryFn() {
      if (selected) return selected;
      const { data } = await axios.get<Hotel>(
        `http://localhost:3000/api/v1/hotels/id/${hotelId}`
      );
      return data;
    },
  });

  return (
    <>
      <div className="w-96 h-64 bg-white">
        <div className="du-carousel w-full h-full">
          {hotel?.images.map((i, id, arr) => (
            <div
              key={i.full}
              id={`slide${id + 1}`}
              className="du-carousel-item relative w-full"
            >
              <img
                src={`/images/full/${i.full}`}
                className="w-full object-cover"
              />
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a
                  href={`#slide${id === 0 ? arr.length : id}`}
                  className="du-btn du-btn-circle"
                >
                  ❮
                </a>
                <a
                  href={`#slide${id === arr.length - 1 ? 1 : id + 2}`}
                  className="du-btn du-btn-circle"
                >
                  ❯
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
