import { createFileRoute } from "@tanstack/react-router";
import HotelBooking from "../booking";

export const Route = createFileRoute("/booking/$id")({
  component: HotelBooking,
});
