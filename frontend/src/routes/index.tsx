import { createFileRoute } from "@tanstack/react-router";
import Hero from "../components/Hero.tsx";
import Featured from "../components/Featured.tsx";
import Experiences from "../components/Experiences.tsx";
import "./styles/index.scss";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <Featured />
      <Experiences />
    </>
  );
}
