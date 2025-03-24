import {
  Outlet,
  createRootRoute,
  retainSearchParams,
} from "@tanstack/react-router";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import "../global.scss";
import "../components/styles/index.css";
import { useAtom } from "jotai";
import { geoAtom, userAtom } from "@store";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

export const Route = createRootRoute({
  component: RootComponent,
  search: {
    middlewares: [retainSearchParams(true)],
  },
});

function RootComponent() {
  const [, setLocation] = useAtom(geoAtom);
  const [, setUser] = useAtom(userAtom);

  useQuery<{ lat: number; lon: number }>({
    queryKey: ["location"],
    queryFn: async () => {
      const {
        data: { lat, lon },
      } = await axios.get<{ lat: number; lon: number }>(
        "http://ip-api.com/json/",
      );
      const formatted = { lat, lon };
      setLocation(formatted);
      return formatted;
    },
    initialData: { lat: 0, lon: 0 },
  });

  useEffect(() => {
    async function check() {
      try {
        const { data } = await axios.post<User>(
          "http://localhost:3000/api/v1/check",
          null,
          { withCredentials: true },
        );

        setUser(data);
      } catch (e) {
        console.error(e);
      }
    }
    check();
  }, []);

  return (
    <>
      <Header />
      <main className="dark:bg-base-100 dark:text-white not-dark:bg-white text-black">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
