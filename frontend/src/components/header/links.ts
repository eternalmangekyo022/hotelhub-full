import About from "/images/about.png";
import Search from "/vectors/search.svg";
import Contact from "/vectors/contact.svg";
import House from "/vectors/house.svg";

type IPages = "" | "about" | "contact" | "hotels" | "register";

type IHeaderLink = {
  docTitle: string;
  link: `/${IPages}`;
  title: string;
  img: string;
};

export default [
  {
    docTitle: "HotelHub™ - Home",
    link: "/",
    title: "Home",
    img: House,
  },
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
    img: Search,
  },
  {
    docTitle: "HotelHub™ - Contact",
    link: "/contact",
    title: "Contact",
    img: Contact,
  },
] as IHeaderLink[];
