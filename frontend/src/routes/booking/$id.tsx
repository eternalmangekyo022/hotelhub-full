import { createFileRoute } from '@tanstack/react-router'
import HotelBooking  from '../Booking'

export const Route = createFileRoute('/booking/$id')({
  component: HotelBooking,
})


