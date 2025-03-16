import useScreen from "../hooks/useScreen.ts";
import { Link, useRouter, useLocation } from "@tanstack/react-router";
import Menu from "../assets/images/Menu Icon.png";
import "./styles/header.scss";
import { useAtom } from "jotai";
import { favoritesAtom } from "@store";
import FavoriteHeart from "./FavoriteHeart.tsx";
import Navlink from "./Navlink";

import { useEffect, useRef, useState, useReducer } from "react";
import z from "zod";
import links from "./header/links";

export default function Header() {
  const location = useLocation();
  const LS_KEY = "hotelhub-theme";
  const [width] = useScreen();
  const [favorites] = useAtom(favoritesAtom);
  const listRef = useRef<HTMLUListElement>(null);
  const [selectedNav, setSelectedNav] = useState<number>(0);
  const [navVisible, setNavVisible] = useState(false);
  const [distance, setDistance] = useState(0);
  const [isDark, dispatchIsDark] = useReducer(themeReducer, false);
  const router = useRouter();
  const COLS = 4;

  function themeReducer(
    state: boolean,
    action: { type: "on" | "off" | "toggle" }
  ) {
    localStorage.setItem(
      LS_KEY,
      { on: "dark", off: "light", toggle: state ? "light" : "dark" }[
        action.type
      ]
    );
    switch (action.type) {
      case "on":
        toggleHtmlData(true);
        return true;
      case "off":
        toggleHtmlData(false);
        return false;
      case "toggle":
        toggleHtmlData(!state);
        return !state;
    }
  }

  function calcDistance() {
    if (!listRef.current) return 0;
    const { clientWidth: w } = listRef.current;
    const fr = w / COLS;
    return fr * selectedNav + fr / 2;
  }

  function toggleHtmlData(isDark: boolean) {
    const html = document.querySelector("html");
    html?.setAttribute("data-theme", isDark ? "dark" : "light");
  }

  useEffect(() => {
    setDistance(calcDistance());
    setNavVisible(true);
  }, [selectedNav]);

  useEffect(() => {
    for (let i = 0; i < links.length; i++) {
      if (router.history.location.pathname === links[i].link) setSelectedNav(i);
    }

    router.history.subscribe((e) => {
      for (let i = 0; i < links.length; i++) {
        if (e.location.pathname === links[i].link) setSelectedNav(i);
      }
      if (e.location.pathname === "/favorites") setNavVisible(false);
    });
    if (!listRef.current) return;

    function onResize() {
      const d = calcDistance();
      setDistance(d);
    }

    window.addEventListener("resize", onResize);

    const saved = localStorage.getItem(LS_KEY);

    if (saved) {
      const savedSchema = z.string().regex(/^(light|dark)$/);
      const { success } = savedSchema.safeParse(saved);
      if (success) {
        switch (saved as "light" | "dark") {
          case "dark":
            dispatchIsDark({ type: "on" });
            break;
          case "light":
            dispatchIsDark({ type: "off" });
            break;
        }
      }
    }

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    z
      .string()
      .regex(/^(login|register)$/)
      .safeParse(location.pathname).success && (
      <>
        <header>
          <nav className="navbar">
            {width <= 768 ? (
              <>
                <img src={Menu} alt="Menu" className="menu-icon" />
              </>
            ) : (
              <ul
                ref={listRef}
                className="du-menu p-0 w-full h-[70%] bg-base-200 rounded-box mt-6 grid items-center relative hover-link not-dark:bg-blue-900 dark:bg-blue-950"
                style={{
                  gridTemplateColumns: `repeat(${links.length}, minmax(0, 1fr))`,
                }}
              >
                <div
                  className="circle-backdrop -translate-y-1/2 transition-[.3s]"
                  style={{
                    transform: `translateX(calc(${distance}px - 50%))`,
                    opacity: navVisible ? 1 : 0,
                  }}
                ></div>
                {links.map(({ link, title, docTitle, img }, idx) => (
                  <Navlink
                    to={
                      ["/register", "/login"].includes(
                        location.pathname.toLowerCase()
                      ) &&
                      (link === "/register" ||
                        (link.toLowerCase() as string) === "/login")
                        ? location.pathname.toLowerCase()
                        : (link.toLowerCase() as string)
                    }
                    key={link}
                    onClick={() => {
                      document.title = docTitle;
                      if (selectedNav === idx) return;
                      setSelectedNav(idx);
                    }}
                    src={img}
                  >
                    {title}
                  </Navlink>
                ))}
              </ul>
            )}
          </nav>
          <div className="favorites-button w-24 flex justify-around items-center">
            <Link
              to="/favorites"
              className="grid place-content-center relative"
            >
              <FavoriteHeart color="#000" active />
              <p className="favorites-count absolute -right-0 bottom-2 text-white">
                {favorites.length}
              </p>
            </Link>
            <label className="du-swap du-swap-rotate text-white">
              <input
                type="checkbox"
                className="du-theme-controller"
                value="dark"
                checked={isDark}
                onChange={() => {
                  dispatchIsDark({ type: "toggle" });
                }}
              />

              <svg
                className="du-swap-off w-8 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>

              <svg
                className="du-swap-on w-8 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </label>
          </div>
        </header>
      </>
    )
  );
}
