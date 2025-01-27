import '../components/styles/timeline.scss'

export default function TimeLine() {
	const timelines: TimeLine[] = [
		{
			date: 2019,
			description: "Birth of DineEase"
		},
		{
			date: 2020,
			description: "Culinary Connections Made"
		},
		{
			date: 2021,
			description: "Curatorial Excellence Emerges"
		},
		{
			date: 2022,
			description: "Redefining Dining	Landscape"
		},
		{
			date: 2023,
			description: "Redefining Dining Landscape"
		}
	];

	return <section className='timeline-container'>
		{timelines.map(({ date, description }, idx) => <>
			<div className={`timeline${(idx + 1) % 2 !== 0 ? " reverse": ""}`}>
				<div className="circle" /* circle, center */ data-date={date}>
					<div/>
				</div>
				<div>
					<div className="pointer">
						<div className="pointer-dot" />
						<div className="pointer-line" />
					</div>
					<span>{description}</span>
				</div>
				<div></div>
			</div>
		</>)}
	</section>
	
}