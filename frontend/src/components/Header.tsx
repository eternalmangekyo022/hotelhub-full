import useScreen from "../hooks/useScreen.ts";
import { Link, useRouter } from "@tanstack/react-router";
//import Logo from "../assets/images/Logo.png";
import Menu from "../assets/images/Menu Icon.png";
import "./styles/header.scss";
import { favoritesAtom } from "../store.ts";
import { useAtom } from "jotai";
import FavoriteHeart from "./FavoriteHeart.tsx";
import Navlink from "./Navlink";

import { useEffect, useRef, useState } from "react";
import links from "./header/links";

export default function Header() {
  const [width] = useScreen();
  const [favorites] = useAtom(favoritesAtom);
  const listRef = useRef<HTMLUListElement>(null);
  const [selectedNav, setSelectedNav] = useState<[number, number]>([0, 0]);
  const [navVisible, setNavVisible] = useState(false);
  const [distance, setDistance] = useState(0);
  const router = useRouter();
  const COLS = 4;

  function calcDistance(specific?: number) {
    if (!listRef.current) return 0;
    const { clientWidth: w } = listRef.current;
    const fr = w / COLS;
    return fr * (specific || selectedNav[1]) + fr / 2;
  }

  useEffect(() => {
    setDistance(calcDistance());
    setNavVisible(true);
  }, [selectedNav]);

  useEffect(() => {
    for (let i = 0; i < links.length; i++) {
      if (router.history.location.pathname === links[i].link)
        setSelectedNav([0, i]);
    }

    router.history.subscribe((e) => {
      for (let i = 0; i < links.length; i++) {
        if (e.location.pathname === links[i].link) setSelectedNav([0, i]);
      }
    });
  }, []);

  return (
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
              className="du-menu p-0 w-full h-[70%] bg-base-200 rounded-box mt-6 grid items-center relative hover-link"
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
                    if (selectedNav[1] === idx) return;
                    setSelectedNav((prev) => [prev[1], idx]);
                  }}
                  src={img}
                >
                  {title}
                </Navlink>
              ))}
            </ul>
          )}
        </nav>
        <Link to="/favorites" className="favorites-button navlink">
          <FavoriteHeart color="#000" active />
          <p className="favorites-count">{favorites.length}</p>
        </Link>
      </header>
    </>
  );
}
