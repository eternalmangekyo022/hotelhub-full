import axios from 'axios'
import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { useForm, FormProvider } from 'react-hook-form'
import { useState, useEffect } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'
import CardPay from '../../../components/CardPay'
import { onSubmit, calculateTotalPrice } from '@/utils/booking.utils'

export const Route = createFileRoute('/hotels/$hotelId/booking')({
  component: HotelBooking,
  loader: async ({
    params: { hotelId },
  }): Promise<{ user: User; hotel: Hotel }> => {
    try {
      const { data: user, status } = await axios.post(
        'http://localhost:3000/api/v1/check',
        {},
        { withCredentials: true },
      )

      const { data: hotel } = await axios.get(
        `http://localhost:3000/api/v1/hotels/id/${hotelId}`,
      )
      if (status !== 200) {
        throw redirect({
          to: '/Login',
          search: {
            redirect: encodeURIComponent(`/hotels/${hotelId}/booking`),
          },
        })
      }
      return { user, hotel }
    } catch (error) {
      throw redirect({
        to: '/Login',
        search: {
          redirect: encodeURIComponent(`/hotels/${hotelId}/booking`),
        },
      })
    }
  },
})

function HotelBooking() {
  const { hotel, user } = Route.useLoaderData()
  const [totalPrice, setTotalPrice] = useState(0)
  const [beforeTaxPrice, setBeforeTaxPrice] = useState(0)
  const navigate = useNavigate()

  const formMethods = useForm({
    mode: 'onSubmit',
    defaultValues: {
      firstname: user?.firstname || '',
      lastname: user?.lastname || '',
      participants: '' as unknown as number,
      address: '',
      payment_id: (hotel.payment_id === 3
        ? ''
        : hotel.payment_id === 2
          ? 'card'
          : 'cash') as 'cash' | 'card' | '',
      arrivalDate: new Date(),
      leavingDate: new Date(),
      postCode: '' as unknown as number,
      ccNumber: '',
      ccExpiry: '',
      ccCvv: '',
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = formMethods

  const arrivalDate = watch('arrivalDate')
  const leavingDate = watch('leavingDate')
  const participants = watch('participants')
  const paymentMethod = watch('payment_id')

  useEffect(() => {
    calculateTotalPrice(
      arrivalDate,
      leavingDate,
      hotel,
      participants,
      (total) => {
        setTotalPrice(total)
        setBeforeTaxPrice(total / 1.27)
      },
    )
  }, [watch('arrivalDate'), watch('leavingDate'), watch('participants')])

  useEffect(() => {
    if (user) {
      setValue('firstname', user.firstname)
      setValue('lastname', user.lastname)
    }
  }, [user])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 [&_input,&_select]:not-dark:bg-white [*]:not-dark:text-black">
      <div className="du-card bg-base-100 shadow-xl">
        <div className="du-card-body space-y-8 rounded-xl border-0! not-dark:bg-gray-300">
          <h2 className="du-card-title mb-8 text-3xl font-bold">
            Hotel Booking
          </h2>
          {hotel && (
            <div className="bg-base-200 ! my-5! rounded-lg p-6 not-dark:bg-gray-400">
              <h3 className="text-2xl font-semibold">{hotel.name}</h3>
              <p className="mt-2 text-lg">
                Price per night:
                <span className="font-bold">${hotel.price}</span>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Max capacity: {hotel.capacity} participants
              </p>
            </div>
          )}
          <form
            onSubmit={handleSubmit(async (data) =>
              onSubmit(
                data,
                user!,
                hotel!,
                () => navigate({ to: '/hotels' }),
                totalPrice,
              ),
            )}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="du-form-control">
                <label className="du-label">
                  <span className="du-label-text">First Name</span>
                </label>
                <input
                  className={`du-input du-input-bordered ${errors.firstname ? 'du-input-error' : ''}`}
                  {...register('firstname', { required: true })}
                />
                {errors.firstname && (
                  <label className="du-label">
                    <span className="du-label-text-alt text-error">
                      First name is required
                    </span>
                  </label>
                )}
              </div>
              <div className="du-form-control">
                <label className="du-label">
                  <span className="du-label-text">Last Name</span>
                </label>
                <input
                  className={`du-input du-input-bordered ${errors.lastname ? 'du-input-error' : ''}`}
                  {...register('lastname', { required: true })}
                />
                {errors.lastname && (
                  <label className="du-label">
                    <span className="du-label-text-alt text-error">
                      Last name is required
                    </span>
                  </label>
                )}
              </div>
              <div className="du-form-control">
                <label className="du-label">
                  <span className="du-label-text">Address</span>
                </label>
                <input
                  className={`du-input du-input-bordered ${errors.address ? 'du-input-error' : ''}`}
                  {...register('address', { required: true })}
                />
                {errors.address && (
                  <label className="du-label">
                    <span className="du-label-text-alt text-error">
                      Address is required
                    </span>
                  </label>
                )}
              </div>
              <div className="du-form-control">
                <label className="du-label">
                  <span className="du-label-text">Post Code</span>
                </label>
                <input
                  className={`du-input du-input-bordered ${errors.postCode ? 'du-input-error' : ''}`}
                  {...register('postCode', {
                    required: true,
                    valueAsNumber: true,
                    onChange: (e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      e.target.value = value
                    },
                  })}
                />
                {errors.postCode && (
                  <label className="du-label">
                    <span className="du-label-text-alt text-error">
                      Post code is required
                    </span>
                  </label>
                )}
              </div>
            </div>
            <div className="my-8! grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="du-form-control">
                <label className="du-label">
                  <span className="du-label-text">Arrival Date</span>
                </label>
                <DatePicker
                  minDate={new Date()}
                  popperPlacement="top"
                  selected={watch('arrivalDate')}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="yyyy-MM-dd HH:mm"
                  className={`du-input du-input-bordered w-full ${errors.arrivalDate ? 'du-input-error' : ''}`}
                  {...(register('arrivalDate', { required: true }) as any)}
                  onChange={(date) => {
                    setValue('arrivalDate', date as Date)
                  }}
                />
                {errors.arrivalDate && (
                  <label className="du-label">
                    <span className="du-label-text-alt text-error">
                      Arrival date is required
                    </span>
                  </label>
                )}
              </div>
              <div className="du-form-control">
                <label className="du-label">
                  <span className="du-label-text">Leaving Date</span>
                </label>
                <DatePicker
                  minDate={new Date()}
                  popperPlacement="top"
                  selected={watch('leavingDate')}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="yyyy-MM-dd HH:mm"
                  className={`du-input du-input-bordered w-full ${errors.leavingDate ? 'du-input-error' : ''}`}
                  {...(register('leavingDate', { required: true }) as any)}
                  onChange={(date) => {
                    setValue('leavingDate', date as Date)
                  }}
                />
                {errors.leavingDate && (
                  <label className="du-label">
                    <span className="du-label-text-alt text-error">
                      Leaving date is required
                    </span>
                  </label>
                )}
              </div>
            </div>
            <div className="du-form-control mt-4 w-full max-w-xs">
              <label className="du-label">
                <span className="du-label-text">Number of Participants</span>
              </label>
              <input
                className={`du-input du-input-bordered ${errors.participants ? 'du-input-error' : ''}`}
                {...register('participants', {
                  required: true,
                  valueAsNumber: true,
                  onChange: (e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    setValue(
                      'participants',
                      value > (hotel?.capacity || 0)
                        ? hotel?.capacity || 0
                        : value,
                    )
                  },
                })}
              />
              {errors.participants && (
                <label className="du-label">
                  <span className="du-label-text-alt text-error">
                    Number of participants is required
                    {errors.participants.message as string}
                  </span>
                </label>
              )}
            </div>
            <div className="du-form-control mt-6 w-full max-w-xs">
              <label className="du-label">
                <span className="du-label-text">Payment Method</span>
              </label>
              <select
                className={`du-select du-select-bordered ${errors.payment_id ? 'du-select-error' : ''}`}
                disabled={hotel?.payment_id !== 3}
                {...register('payment_id', { required: true })}
              >
                {hotel?.payment_id === 3 && (
                  <option value="">Select payment method</option>
                )}
                {[1, 3].includes(hotel?.payment_id || 0) && (
                  <option value="cash">Cash</option>
                )}
                {[2, 3].includes(hotel?.payment_id || 0) && (
                  <option value="card">Card</option>
                )}
              </select>
              {errors.payment_id && (
                <label className="du-label">
                  <span className="du-label-text-alt text-error">
                    Payment method is required
                  </span>
                </label>
              )}
            </div>
            {paymentMethod === 'card' && (
              <FormProvider {...formMethods}>
                <CardPay />
              </FormProvider>
            )}
            <div className="bg-base-200 ! my-5! rounded-lg p-6 not-dark:bg-gray-400">
              <h4 className="mb-4 text-xl font-semibold">Price Calculation</h4>
              <div className="space-y-3">
                <p className="flex justify-between">
                  <span>Before Tax Price:</span>
                  <strong>${beforeTaxPrice.toFixed(2)}</strong>
                </p>
                <p className="flex justify-between">
                  <span>Tax (27%):</span>
                  <strong>${(totalPrice - beforeTaxPrice).toFixed(2)}</strong>
                </p>
                <p className="border-base-300 flex justify-between border-t pt-3 text-lg font-bold">
                  <span>Total Price:</span>
                  <strong>${totalPrice.toFixed(2)}</strong>
                </p>
              </div>
            </div>
            <div className="du-card-actions mt-10 justify-end">
              <button
                type="submit"
                className="du-btn du-btn-primary w-full px-8 py-3 md:w-auto"
              >
                Submit Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default HotelBooking
