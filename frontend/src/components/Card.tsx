import Star from '../assets/images/star.png'
import { Link } from '@tanstack/react-router'

interface IProps {
  name: string
  description: string
  rating: number
  image: string
  uid: number
}

export default function Card({
  name,
  description,
  rating,
  image,
  uid,
}: IProps) {
  return (
    <div className="du-card dark:bg-base-100 border-base-200 inset-shadow- w-96 inset-shadow-purple-600 not-dark:bg-blue-200 lg:h-7/8">
      <figure>
        <img className="w-full" src={image} alt={name} />
      </figure>
      <div className="du-card-body dark:bg-base-300 rounded-b-2xl not-dark:bg-blue-200">
        <div className="flex items-center justify-between leading-0">
          <h2 className="du-card-title">{name}</h2>
          <div className="flex items-center">
            {Array.from({ length: 5 }, (_, index) => (
              <img
                key={index}
                src={Star}
                alt="star"
                className="h-4 w-4"
                style={{
                  filter: index + 1 > rating ? 'saturate(0)' : undefined,
                }}
              />
            ))}
          </div>
        </div>
        <p className="leading-6">{description}</p>
        <div className="du-card-actions justify-end">
          <Link
            to={`/hotels/${uid}` as string}
            className="du-btn du-btn-soft du-btn-info h-9"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}
