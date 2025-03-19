import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { createFileRoute, useParams } from '@tanstack/react-router'
import 'react-datepicker/dist/react-datepicker.css'
import "./styles/booking.scss"
import { useAtom } from 'jotai'
import { userAtom } from '../store'

const HotelBooking = () => {
  const { id } = useParams({ strict: false })
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user] = useAtom(userAtom)

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/hotels/id/${id}`)
        if (!response.ok) throw new Error('Hotel not found')
        const data = await response.json()
        setHotel(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchHotel()
  }, [id])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user?.firstname,
      lastName: user?.lastname
    }
  })
  const [arrivalDate, setArrivalDate] = useState(null)
  const [leavingDate, setLeavingDate] = useState(null)

  const onSubmit = (data) => {
    const bookingData = {
      ...data,
      user_id: user?.id, // Assuming the user object has an id
      hotel_id: id,
      booked: new Date().toISOString(), // Current timestamp
      checkin: arrivalDate.toISOString(),
      checkout: leavingDate.toISOString(),
      payment_id: data.payment_id === 'cash' ? 1 : 2, // Assuming 1 for cash, 2 for card
      participants: parseInt(data.participants, 10),
      hotelName: hotel?.name,
      price: hotel?.price
    }
    console.log(bookingData)
    alert('Booking submitted!')
  }

  if (loading) return <div className="container">Loading...</div>
  if (error) return <div className="container">Error: {error}</div>

  return (
    <div className="container">
      <h2 className="title">Hotel Booking</h2>
      {hotel && (
        <div className="hotel-info">
          <h3>{hotel.name}</h3>
          <p>Price per night: ${hotel.price}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-grid">
          <div className="left-column">
            <div className="field">
              <label className="label">First Name</label>
              <input
                className="input"
                {...register('firstName', { required: true })}
                readOnly
              />
              {errors.firstName && (
                <span className="error">First name is required</span>
              )}
            </div>

            <div className="field">
              <label className="label">Last Name</label>
              <input
                className="input"
                {...register('lastName', { required: true })}
                readOnly
              />
              {errors.lastName && (
                <span className="error">Last name is required</span>
              )}
            </div>

            <div className="field">
              <label className="label">Address</label>
              <input
                className="input"
                {...register('address', { required: true })}
              />
              {errors.address && (
                <span className="error">Address is required</span>
              )}
            </div>

            <div className="field">
              <label className="label">Post Code</label>
              <input
                className="input"
                {...register('postCode', { required: true })}
              />
              {errors.postCode && (
                <span className="error">Post code is required</span>
              )}
            </div>
          </div>

          <div className="right-column">
            <div className="field">
              <label className="label">Credit Card Number</label>
              <input
                type="text"
                className="input"
                {...register('ccNumber', { required: true })}
              />
              {errors.ccNumber && (
                <span className="error">Credit card number is required</span>
              )}
            </div>

            <div className="field">
              <label className="label">Expiry Date</label>
              <input
                type="text"
                className="input"
                placeholder="MM/YY"
                maxLength={5}
                {...register('ccExpiry', { required: true })}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D+/g, '');
                  const newValue = value.replace(/(\d{2})(?=\d)/g, '$1/');
                  e.target.value = newValue;
                }}
              />
              {errors.ccExpiry && (
                <span className="error">Expiry date is required</span>
              )}
            </div>

            <div className="field">
              <label className="label">CVV</label>
              <input
                type="text"
                className="input"
                maxLength={3}
                inputMode="numeric"
                pattern="[0-9]{3}"
                {...register('ccCvv', { required: true })}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  e.target.value = value;
                }}
              />
              {errors.ccCvv && (
                <span className="error">CVV is required</span>
              )}
            </div>
          </div>
        </div>

        <div className="field">
          <label className="label">Arrival Date</label>
          <DatePicker
            popperPlacement='top'
            selected={arrivalDate}
            onChange={(date) => setArrivalDate(date)}
            className="input"
          />
        </div>

        <div className="field">
          <label className="label">Leaving Date</label>
          <DatePicker
            popperPlacement='top'
            selected={leavingDate}
            onChange={(date) => setLeavingDate(date)}
            className="input"
          />
        </div>

        <div className="field">
          <label className="label">Number of Participants</label>
          <input
            type="number"
            className="input"
            min={1}
            max={hotel?.capacity}
            {...register('participants', {
              required: true,
              valueAsNumber: true,
              onChange: (e) => {
                const value = Number(e.target.value);
                if (value > hotel?.capacity) {
                  e.target.value = hotel?.capacity;
                }
              },
            })}
          />
          {errors.participants && (
            <span className="error">Number of participants is required</span>
          )}
        </div>

        <div className="field">
          <label className="label">Payment Method</label>
          <select
            className="input"
            {...register('payment_id', { required: true })}
          >
            <option value="">Select payment method</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
          </select>
          {errors.payment_id && (
            <span className="error">Payment method is required</span>
          )}
        </div>

        <button
          type="submit"
          className="button"
        >
          Submit Booking
        </button>
      </form>
    </div>
  )
}

export const Route = createFileRoute('/Booking')({
  component: HotelBooking,
})

export default HotelBooking
