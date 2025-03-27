import '../components/styles/timeline.scss'

interface ITimeLine {
  date: number
  description: string
}

export default function TimeLine() {
  const timelines: ITimeLine[] = [
    {
      date: 0,
      description: 'Birth of HotelHub',
    },
    {
      date: 0,
      description: 'Culinary Connections Made',
    },
    {
      date: 0,
      description: 'Curatorial Excellence Emerges',
    },
    {
      date: 0,
      description: 'Redefining Dining	Landscape',
    },
    {
      date: 0,
      description: 'Redefining Dining Landscape',
    },
  ].map((i, idx) => ({ ...i, date: idx + 2021 }))

  return (
    <section className="timeline-container">
      {timelines.map(({ date, description }, idx) => (
        <div
          key={idx}
          className={`timeline ${(idx + 1) % 2 !== 0 ? 'reverse' : ''}`}
        >
          <div className="circle" /* circle, center */ data-date={date}>
            <div />
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
      ))}
    </section>
  )
}
