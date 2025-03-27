import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export function formatDate(date: Date) {
  const pad = (num: number) => (num < 10 ? `0${num}` : num)
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export async function onSubmit(data: {
  firstname: string
  lastname: string
  participants: number
  payment_id: string
  arrivalDate: Date
  leavingDate: Date
  ccNumber: string
  ccExpiry: string
  ccCvv: string
}, user: User, hotel: Hotel, cb: () => void, totalPrice: number) {
  const bookingData = {
    user_id: user?.id,
    hotel_id: hotel.id,
    booked: formatDate(new Date()),
    checkin: formatDate(data.arrivalDate),
    checkout: formatDate(data.leavingDate),
    payment_id: data.payment_id === 'cash' ? 1 : 2,
    participants: data.participants,
    rating: 0,
    ccNumber: data.ccNumber,
    ccExpiry: data.ccExpiry,
    ccCvv: data.ccCvv,
  }

  try {
    await axios.post('http://localhost:3000/api/v1/bookings', bookingData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    await axios.post(
      'http://localhost:3000/api/v1/email/send-booking-email',
      {
        email: user?.email,
        firstname: user?.firstname,
        lastname: user?.lastname,
        hotel,
        checkin: bookingData.checkin,
        checkout: bookingData.checkout,
        totalPrice,
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    console.log('email sent to ' + user?.email)

    alert(
      'Booking submitted successfully! A confirmation email has been sent.',
    )
    cb()
  } catch (error) {
    console.error('Error:', error)
    alert('An error occurred while submitting the booking.')
  }
}

export function calculateTotalPrice(arrivalDate: Date | null, leavingDate: Date | null, hotel: Hotel | undefined, participants: number, cb: (total: number) => void) {
  if (!arrivalDate || !leavingDate || !hotel) return

  const timeDifference = leavingDate.getTime() - arrivalDate.getTime()
  const nights = Math.ceil(timeDifference / (1000 * 3600 * 24))

  const total = Math.min(participants, hotel.capacity) * hotel.price * nights
  cb(total)
}

export function useHotel(hotelId: string | undefined) {
  const {
    data: hotel,
    isPending: loading,
    error,
  } = useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: async () =>
      (
        await axios.get<Hotel>(
          `http://localhost:3000/api/v1/hotels/id/${hotelId}`,
        )
      ).data,
    enabled: !!hotelId
  })

  return { hotel, loading, error }
}