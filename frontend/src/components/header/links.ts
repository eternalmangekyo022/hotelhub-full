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

export default [
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
] as IHeaderLink[];
