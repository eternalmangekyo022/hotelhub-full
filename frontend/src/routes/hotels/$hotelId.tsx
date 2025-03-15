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

  return hotel?.id;
}
