import { useState } from 'react'
import { useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { createFileRoute } from '@tanstack/react-router'
import 'react-datepicker/dist/react-datepicker.css'
import "./styles/booking.scss"



const HotelBooking = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [arrivalDate, setArrivalDate] = useState(null)
  const [leavingDate, setLeavingDate] = useState(null)

  const onSubmit = (data) => {
    console.log({ ...data, arrivalDate, leavingDate })
    alert('Booking submitted!')
  }

  return (
    <div className="container">
  <h2 className="title">Hotel Booking</h2>
  <form onSubmit={handleSubmit(onSubmit)} className="form">
    <div className="form-grid">
      <div className="left-column">
        <div className="field">
          <label className="label">First Name</label>
          <input
            className="input"
            {...register('firstName', { required: true })}
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
            type="number"
            className="input"
            placeholder="MM/YY"
            {...register('ccExpiry', { required: true })}
          />
          {errors.ccExpiry && (
            <span className="error">Expiry date is required</span>
          )}
        </div>

        <div className="field">
          <label className="label">CVV</label>
          <input
            type="number"
            className="input"
            max={999}
            {...register('ccCvv', { required: true })}
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

