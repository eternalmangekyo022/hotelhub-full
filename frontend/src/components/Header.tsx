import useScreen from "../hooks/useScreen.ts";
import { Link, useLocation } from "@tanstack/react-router";
import Logo from "../assets/images/Logo.png";
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
  const location = useLocation();
  const [favorites] = useAtom(favoritesAtom);
  const listRef = useRef<HTMLUListElement>(null);
  const [selectedNav, setSelectedNav] = useState<[number, number]>([-1, -1]);
  const [navVisible, setNavVisible] = useState<boolean>(false);
  const [distance, setDistance] = useState(0);

  function calcDistance() {
    if (!listRef.current) return 0;
    const { clientWidth: w } = listRef.current;
    return (w / 5) * selectedNav[selectedNav[1] === -1 ? 0 : 1] + w / 2;
  }

  useEffect(() => {
    if (selectedNav.some((i) => i > -1)) {
      setDistance(calcDistance());
    }
  }, [selectedNav]);

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
              className="menu menu-horizontal w-full h-[70%] bg-base-200 rounded-box mt-6 grid grid-cols-5 items-center relative hover-link"
            >
              <div
                className="circle -translate-y-1/2 transition-[.3s]"
                style={{
                  transform: `translate(calc(${distance}px - 50%), ${navVisible ? "0" : "40%"})`,
                  opacity: selectedNav[1] === -1 ? 0 : navVisible ? 1 : 0,
                }}
              ></div>
              <Link
                to="/"
                className="col-span-2 w-full"
                onClick={() => {
                  if (selectedNav[1] === -1) return;
                  setSelectedNav((prev) => [prev[1], -1]);
                  setNavVisible(false);
                }}
              >
                <img
                  src={Logo}
                  alt="HotelHub logo"
                  className="cursor-pointer px-2"
                />
              </Link>
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
                  onMouseOver={() => {
                    if (navVisible) return;
                    setSelectedNav((prev) => [prev[1], idx]);
                  }}
                  onClick={() => {
                    document.title = docTitle;
                    setNavVisible(true);
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
