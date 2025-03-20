import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { createFileRoute, useParams } from '@tanstack/react-router'
import 'react-datepicker/dist/react-datepicker.css'
<<<<<<< HEAD
import "./styles/booking.scss"
import { useAtom } from 'jotai'
import { userAtom } from '../store'
=======
import './styles/booking.scss'
>>>>>>> d8b7e5507eabfdae4aa8d63fba6fd6318639155a

const HotelBooking = () => {
  const { id } = useParams({ strict: false })
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user] = useAtom(userAtom)

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/hotels/id/${id}`,
        )
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
      firstname: user?.firstname,
      lastname: user?.lastname
    }
  })
  const [arrivalDate, setArrivalDate] = useState(null)
  const [leavingDate, setLeavingDate] = useState(null)

  const formatDate = (date) => {
    const pad = (num) => (num < 10 ? `0${num}` : num)
    const year = date.getFullYear()
    const month = pad(date.getMonth() + 1)
    const day = pad(date.getDate())
    const hours = pad(date.getHours())
    const minutes = pad(date.getMinutes())
    const seconds = pad(date.getSeconds())
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const onSubmit = async (data) => {
    const bookingData = {
      user_id: user?.id,
      hotel_id: id,
      booked: formatDate(new Date()),
      checkin: formatDate(arrivalDate),
      checkout: formatDate(leavingDate),
      payment_id: data.payment_id === 'cash' ? 1 : 2,
      participants: parseInt(data.participants, 10),
      rating: 0
    }
    
    try {
      const response = await fetch('http://localhost:3000/api/v1/bookings', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      const result = await response.json();
      console.log(result);
      alert('Booking submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the booking');
    }
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
                {...register('firstname', { required: true })}
                readOnly
              />
              {errors.firstname && (
                <span className="error">First name is required</span>
              )}
            </div>

            <div className="field">
              <label className="label">Last Name</label>
              <input
                className="input"
                {...register('lastname', { required: true })}
                readOnly
              />
              {errors.lastname && (
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
          minDate={new Date()}
            popperPlacement='top'
            selected={arrivalDate}
            onChange={(date) => setArrivalDate(date)}
            className="input"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="yyyy-MM-dd HH:mm:ss"
          />
        </div>

        <div className="field">
          <label className="label">Leaving Date</label>
          <DatePicker
          minDate={new Date()}
            popperPlacement='top'
            selected={leavingDate}
            onChange={(date) => setLeavingDate(date)}
            className="input"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="yyyy-MM-dd HH:mm:ss"
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
