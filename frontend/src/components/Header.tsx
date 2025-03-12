import useScreen from "../hooks/useScreen.ts";
import { Link, useLocation } from "@tanstack/react-router";
import Logo from "../assets/images/Logo.png";
import Menu from "../assets/images/Menu Icon.png";
import "./styles/header.scss";
import { favoritesAtom } from "../store.ts";
import { useAtom } from "jotai";
import FavoriteHeart from "./FavoriteHeart.tsx";
import Navlink from "./Navlink";
import About from "/images/about.png";
import HotelSign from "/vectors/hotel-sign.svg";
import Contact from "/vectors/contact.svg";

type IPages = "" | "about" | "contact" | "hotels" | "register";

type IHeaderLink = {
  docTitle: string;
  link: `/${IPages}`;
  title: string;
  img: string;
};

const links: IHeaderLink[] = [
  {
    docTitle: "HotelHub™ - About",
    link: "/about",
    title: "About Us",
    img: About,
  },
  {
    docTitle: "HotelHub™ - Hotels",
    link: "/hotels",
    title: "Hotels",
    img: HotelSign,
  },
  {
    docTitle: "HotelHub™ - Contact",
    link: "/contact",
    title: "Contact",
    img: Contact,
  },
];

export default function Header() {
  const [width] = useScreen();
  const location = useLocation();
  const [favorites] = useAtom(favoritesAtom);
  return (
    <>
      <header>
        <nav className="navbar">
          {width <= 768 ? (
            <>
              <img src={Menu} alt="Menu" className="menu-icon" />
            </>
          ) : (
            <ul className="menu menu-horizontal w-96 h-[80%] bg-base-200 rounded-box mt-6 grid grid-cols-5 items-center">
              <Link to="/" className="col-span-2 w-full">
                <img
                  src={Logo}
                  alt="HotelHub logo"
                  className="cursor-pointer px-2"
                />
              </Link>
              {links.map(({ link, title, docTitle, img }) => (
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
                  onClick={() => (document.title = docTitle)}
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
