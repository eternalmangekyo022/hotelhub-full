import Star from '../assets/images/star.png'

export default function Card({ name, description, rating, image, key }: Card & { key: number }) {
	return <div className='card' key={key}>
		<img src={image} alt={name} title={name} />
		<div>
			<span>{name}</span>
			<div className='stars'>
				{[0, 0, 0, 0, 0].map((_, idx) => <img alt={'Star'} key={idx} src={Star} className={'star' + ((idx + 1) <= rating ? ' active': '')} />)}
			</div>
		</div>
		<p>{description}</p>
		<div className='linkto'>View hotel &raquo;</div>
	</div>
}