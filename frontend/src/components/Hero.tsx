//assets
import DineEase from '../assets/images/DineEase.png'
import DineEaseVector from '../assets/images/Hero Illustrationvector.svg'
import Search from '/vectors/search.svg'

//hooks
import useScreen from '../hooks/useScreen.ts'
import { useNavigate } from '@tanstack/react-router'

//styles
import './styles/hero.scss'

export default function Hero() {
  const [width] = useScreen()
  const navigate = useNavigate()

  return (
    <section className="hero">
      <section className="hero-text">
        <h1 className="dark:text-stone-300">
          HotelHub: Explore, Reserve, Relax.
        </h1>
        <p>
          Dive into wonders with HotelHub. We curate top-rated hotels, each with
          distinct flavors and ambiance. From hotels to bnbs&apos;, find your
          perfect spot with HotelHub.
        </p>
        <button type="button" onClick={() => navigate({ to: '/hotels' })}>
          <img width="13%" src={Search} alt="Search" />
          Explore Hotels
        </button>
      </section>
      <div className="hero-image">
        <img
          src={width > 768 ? DineEase : DineEaseVector}
          alt="DineEase Logo"
          title="DineEase Logo"
          className="rounded-xl ring-3 not-dark:shadow-2xl not-dark:ring-0 dark:ring-black"
        />
      </div>
      <div className="blur" />
    </section>
  )
}
