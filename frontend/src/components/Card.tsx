import Star from '../assets/images/star.png';

interface IProps {
	name: string;
	description: string;
	rating: number;
	image: string;
	uid: number;
}

export default function Card({ name, description, rating, image }: IProps) {
	return (
		<div className="card"> {/* Remove the key prop from here */}
			<img src={image} alt={name} title={name} />
			<div>
				<span>{name}</span>
				<div className="stars">
					{[0, 0, 0, 0, 0].map((_, idx) => (
						<img
							alt={'Star'}
							key={idx}
							src={Star}
							className={'star' + (idx + 1 <= rating ? ' active' : '')}
						/>
					))}
				</div>
			</div>
			<p>{description}</p>
			<div className="linkto">View hotel &raquo;</div>
		</div>
	);
}