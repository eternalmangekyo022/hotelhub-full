//module scoped styles
import "./styles/about.scss";

import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

//assets, images
import Person1 from "../assets/images/Person1.png";
import Person2 from "../assets/images/bene.png";
import Person3 from "../assets/images/Person3.png";
import Person4 from "../assets/images/Person4.png";
import Person5 from "../assets/images/Person5.png";

//components
export const Route = createFileRoute("/about")({
  component: About,
});

import TimeLine from "../components/TimeLine.tsx";

export default function About() {
  const people: Person[] = [
    {
      name: "Elena Martinez",
      position: "Founder & CEO",
      img: Person1,
    },
    {
      name: "Bene Zoltán",
      position: "Super CEO",
      img: Person2,
    },
    {
      name: "Sophia Dawson",
      position: "Director of Community Engagement",
      img: Person3,
    },
    {
      name: "Lucas Kim",
      position: "Head of Digital Strategy",
      img: Person4,
    },
    {
      name: "Aisha Abdi",
      position: "Marketing & Brand Manager",
      img: Person5,
    },
  ];

  useEffect(() => {
    document.title = "HotelHub™ - About Us";
  }, []);

  return (
    <>
      <div className="team-wrapper">
        <div className="about-title">
          <h1>About Us</h1>
          <h2>Embracing The Joy of Stays</h2>
        </div>

        <TimeLine />
        <div
          className="dark:du-divider not-dark:du-divider-neutral w-3/4 max-w-[45rem] min-w-[25rem]"
          style={{ marginInline: "auto" }}
        ></div>
        <h1>Meet our Team</h1>
        <h2>The Visionaries Behind HotelHub</h2>

        <div className="people">
          {people.map(({ name, position, img }) => (
            <div className="person" key={position}>
              <img width={"25%"} src={img} alt={name} />
              <h3>{name}</h3>
              <span>{position}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="purple not-dark:bg-blue-400 dark:bg-base-200">
        <div>
          <h1>Connect with HotelHub</h1>
          <p>
            Feining for more? Whether you have questions, feedback, or simply
            wish to share your culinary story, we&apos;re eager to hear from
            you. Dive deeper into the HotelHub experience and let&apos;s make
            every meal memorable.
          </p>
          <button>Connect with HotelHub</button>
        </div>
      </div>
    </>
  );
}
