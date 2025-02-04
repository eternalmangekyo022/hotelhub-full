//assets
import DineEase from '../assets/images/DineEase.png'
import DineEaseVector from '../assets/images/Hero Illustrationvector.svg'
import Search from '../assets/images/Search Icon.png'

//hooks
import useScreen from '../hooks/useScreen.ts'
import { useNavigate } from 'react-router-dom';

//styles
import './styles/hero.scss'

export default function Hero() {
	const [width,] = useScreen();
	const navigate = useNavigate();


	return <section className="hero">
	<section className="hero-text">
		<h1>HotelHub: Explore, Reserve, Relax.</h1>
		<p>Dive into culinary wonders with HotelHub.
			We curate top-rated hotels, each with distinct flavors and ambiance.
			From hotels to bnbs',
			find your perfect spot with HotelHub.
		</p>
		<button type="button" onClick={() => navigate('/hotels')}>
					<img width="13%" src={Search} alt="Search" />Explore Hotels
				</button>	</section>
		<div className="hero-image">
			<img src={width > 768 ? DineEase: DineEaseVector} alt="DineEase Logo" title="DineEase Logo"/>
		</div>
		<div className="blur" />
	</section>
}