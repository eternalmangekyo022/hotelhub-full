import { Outlet, createRootRoute } from "@tanstack/react-router";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import "../global.scss";
import "../components/styles/index.css";
import { useAtom } from "jotai";
import { geoAtom } from "../store.ts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [, setLocation] = useAtom(geoAtom);

  useQuery<{ lat: number; lon: number }>({
    queryKey: ["location"],
    queryFn: async () => {
      const {
        data: { lat, lon },
      } = await axios.get<{ lat: number; lon: number }>(
        "http://ip-api.com/json/"
      );
      const formatted = { lat, lon };
      console.log(formatted);
      setLocation(formatted);
      return formatted;
    },
    initialData: { lat: 0, lon: 0 },
  });

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
