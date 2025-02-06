import './styles/featured.scss';
import topRated from '../assets/data/top-rated-restauransts.json';
import Card from './Card.tsx';

export default function Featured() {
	return (
		<section className="featured">
			<div className="featured-text">
				<h1>Featured Hotels</h1>
				<h2>Discover Unforgettable Stays</h2>
			</div>
			<div className="featured-cards">
				{topRated.map(({ description, image, name, rating, id }) => (
					<Card
						key={id}
						uid={id}
						image={image}
						name={name}
						description={description}
						rating={rating}
					/>
				))}
			</div>
		</section>
	);
}