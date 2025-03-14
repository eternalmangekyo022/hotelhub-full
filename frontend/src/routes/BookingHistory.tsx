import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createFileRoute } from '@tanstack/react-router'


interface Booking {
  id: number;
  user_id: number;
  hotel_id: number;
  booked: string;
  checkin: string;
  checkout: string;
  payment_id: number;
  participants: number;
  rating: number;
}

const BookingHistory = () => {
  const { register, handleSubmit } = useForm();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:3000/api/v1/bookings/${userId}`,
        {
          headers: {
            Authorization: 'Bearer pankix',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: { userId: string }) => {
    if (!data.userId.trim()) return;
    fetchBookings(data.userId.trim());
  };

  return (
    <div className="container">
      <h2 className="title">Booking History</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="field">
          <label className="label">Enter User ID</label>
          <input
            className="input"
            type="text"
            {...register('userId', { required: true })}
            placeholder="User ID"
          />
        </div>
        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Loading...' : 'Get Bookings'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {bookings.length > 0 ? (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <h3>Booking ID: {booking.id}</h3>
              <div className="booking-details">
                <p>
                  <strong>Hotel ID:</strong> {booking.hotel_id}
                </p>
                <p>
                  <strong>Booked On:</strong>{' '}
                  {new Date(booking.booked).toLocaleDateString()}
                </p>
                <p>
                  <strong>Check-in:</strong>{' '}
                  {new Date(booking.checkin).toLocaleDateString()}
                </p>
                <p>
                  <strong>Check-out:</strong>{' '}
                  {new Date(booking.checkout).toLocaleDateString()}
                </p>
                <p>
                  <strong>Participants:</strong> {booking.participants}
                </p>
                <p>
                  <strong>Rating:</strong> {booking.rating}/5
                </p>
                <hr />
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && <p className="no-bookings">No bookings found</p>
      )}
    </div>
  );
};
export const Route = createFileRoute('/BookingHistory')({
  component: BookingHistory,
})
export default BookingHistory;