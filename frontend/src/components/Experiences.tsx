//styles
import './styles/experiences.scss'

//assets
import Quote from '../assets/images/Quote markvector.svg'

//hooks
import useScreen from '../hooks/useScreen.ts'

const experiences: Experience[] = [
	{
		author: "Robert & Emily",
		text: "Exquisite flavors, impeccable service, and a memorable ambiance – HotelHub made our celebration truly special!"
	},
	{
		author: "Lisa & Mark",
		text: "HotelHub guided us to hidden gems we never knew existed! We've become hotel adventurers, thanks to this platform."
	},
	{
		author: "Emma & Jacob",
		text: "HotelHub truly opened our eyes to hidden gems in our city. Each hotel recommendation felt like a personal invitation to explore something new. We thought we knew our local scene, but thanks to HotelHub, we discovered so many more incredible places we never would have found on our own!"
	},	
];

function Experience({ author, text, idx }: Experience & { idx: number }) {

	return <div className="experience" key={idx.toString()}>
		<p>{text}</p>
		<span>{author}</span>
		<img src={Quote} alt="Quote" />
	</div>
}

export default function Experiences() {
	const [width,] = useScreen();
	return <section className="experiences">
		<h1>Delightful Experiences Shared by Our Guests</h1>
		<div className="cards">
			{width > 768 ? <><div>
					<Experience idx={0} author={experiences[0].author} text={experiences[0].text} />
				</div>
				<div className="second">
					{[experiences[2], experiences[1]].map(({ author, text }, idx) => <Experience idx={idx} author={author} text={text} />)}
				</div></>: <div>
					{experiences.map(({ author, text }, idx) => <Experience idx={idx} author={author} text={text} />)}
				</div>
			}
			</div>
	</section>
}