import useScreen from "../hooks/useScreen.ts";
import { Link } from "@tanstack/react-router";
import Logo from "../assets/images/Logo.png";
import Menu from "../assets/images/Menu Icon.png";
import "./styles/header.scss";

type IPages = "" | "about" | "contact" | "hotels" | "register";

type IHeaderLink = {
  docTitle: string;
  link: `/${IPages}`;
  title: string;
};

const links: IHeaderLink[] = [
  { docTitle: "HotelHub™", link: "/", title: "Home" },
  { docTitle: "HotelHub™ - About", link: "/about", title: "About Us" },
  { docTitle: "HotelHub™ - Contact", link: "/contact", title: "Contact" },
  { docTitle: "HotelHub™ - Hotels", link: "/hotels", title: "Hotels" },
  {
    docTitle: "HotelHub™ - Register",
    link: "/register",
    title: "Register/Login",
  },
];

export default function Header() {
  const [width] = useScreen();

  return (
    <>
      <header>
        <nav className="navbar">
          <Link to="/" onClick={() => (document.title = "HotelHub™")}>
            <img src={Logo} alt="Logo" />
          </Link>
          {width <= 768 ? (
            <>
              <img src={Menu} alt="Menu" className="menu-icon" />
            </>
          ) : (
            <>
              {links.map(({ link, title, docTitle }) => (
                <Link
                  key={link}
                  onClick={() => (document.title = docTitle)}
                  to={link}
                  className="navlink underline"
                >
                  {title}
                </Link>
              ))}
            </>
          )}
        </nav>
        <Link to="/favorites" className="wishlist-button navlink">
          <p className="wishlist">Favorites</p>
        </Link>
      </header>
    </>
  );
}
