import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { userAtom } from '../store';
import './styles/bookinghistory.scss';

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

interface Hotel {
  id: number;
  name: string;
  // Add other hotel properties as needed
}

const BookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user] = useAtom(userAtom);
  const [hotels, setHotels] = useState<{ [key: number]: Hotel }>({});

  useEffect(() => {
    if (user?.id) {
      fetchBookings(user.id);
    }
  }, [user]);

  const fetchBookings = async (userId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:3000/api/v1/bookings/${userId}`, {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data);

      // Fetch hotel details for each booking
      data.forEach((booking: Booking) => {
        fetchHotel(booking.hotel_id);
      });
    } catch (err) {
      setError(err.message || 'An error occurred while fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchHotel = async (hotelId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/hotels/id/${hotelId}`, {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch hotel details');
      }

      const hotelData = await response.json();
      setHotels((prevHotels) => ({
        ...prevHotels,
        [hotelId]: hotelData,
      }));
    } catch (err) {
      console.error('Failed to fetch hotel details:', err);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Booking History</h2>

      {loading && <p>Loading...</p>}
      {error && <div className="error-message">{error}</div>}

      {bookings.length > 0 ? (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <h3>Booking ID: {booking.id}</h3>
              <div className="booking-details">
                <p>
                  <strong>Hotel:</strong> {hotels[booking.hotel_id]?.name || 'Loading...'}
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
                  <strong>Rating:</strong> {booking.rating > 0 ? `${booking.rating}/5` : 'Not rated yet'}
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
});

export default BookingHistory;