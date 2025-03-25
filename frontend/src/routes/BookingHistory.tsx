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
  price: number;
}

const BookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user] = useAtom(userAtom);
  const [hotels, setHotels] = useState<{ [key: number]: Hotel }>({});
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null);

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
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data);

      // Fetch hotel details for each booking
      data.forEach((booking: Booking) => {
        fetchHotel(booking.hotel_id);
      });
    } catch (err) {
      setError(err.message || "An error occurred while fetching bookings");
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

  // Handle rating submission
  const handleRate = async (bookingId: number, rating: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/rate/${bookingId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      // Update the bookings state to reflect the new rating
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, rating } : booking
        )
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInvoiceClick = (booking: Booking) => {
    setSelectedBookingForInvoice(booking);
  };

  useEffect(() => {
    if (selectedBookingForInvoice) {
      document.body.classList.add('modal-open');
      // Scroll to the modal
      document.querySelector('.modal')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      document.body.classList.remove('modal-open');
      // Scroll to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedBookingForInvoice]);

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
                  <strong>Booked On:</strong>{" "}
                  {new Date(booking.booked).toLocaleDateString()}
                </p>
                <p>
                  <strong>Check-in:</strong>{" "}
                  {new Date(booking.checkin).toLocaleDateString()}
                </p>
                <p>
                  <strong>Check-out:</strong>{" "}
                  {new Date(booking.checkout).toLocaleDateString()}
                </p>
                <p>
                  <strong>Participants:</strong> {booking.participants}
                </p>
                <p>
                  <strong>Rating:</strong> {booking.rating > 0 ? `${booking.rating}/5` : 'Not rated yet'}
                </p>

                {booking.rating === 0 && (
                  <div className="rating-component">
                    <select
                      defaultValue={0}
                      onChange={(e) => handleRate(booking.id, Number(e.target.value))}
                    >
                      <option value={0} disabled>Rate your stay</option>
                      <option value={1}>1 - Poor</option>
                      <option value={2}>2 - Fair</option>
                      <option value={3}>3 - Good</option>
                      <option value={4}>4 - Very Good</option>
                      <option value={5}>5 - Excellent</option>
                    </select>
                  </div>
                )}
                <hr />
              </div>
              <button 
                onClick={() => handleInvoiceClick(booking)}
                className="invoice-button"
              >
                Check Invoice
              </button>
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && <p className="no-bookings">No bookings found</p>
      )}

      {selectedBookingForInvoice && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Invoice for Booking #{selectedBookingForInvoice.id}</h2>
            {hotels[selectedBookingForInvoice.hotel_id] ? (
              <>
                <div className="invoice-details">
                  <p><strong>Hotel:</strong> {hotels[selectedBookingForInvoice.hotel_id].name}</p>
                  <p><strong>Check-in:</strong> {new Date(selectedBookingForInvoice.checkin).toLocaleDateString()}</p>
                  <p><strong>Check-out:</strong> {new Date(selectedBookingForInvoice.checkout).toLocaleDateString()}</p>
                  
                  {(() => {
                    const checkin = new Date(selectedBookingForInvoice.checkin);
                    const checkout = new Date(selectedBookingForInvoice.checkout);
                    const diffDays = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 3600 * 24));
                    const pricePerDay = hotels[selectedBookingForInvoice.hotel_id].price;
                    const total = pricePerDay * diffDays;
                    const beforeTax = total / 1.27;
                    const tax = total - beforeTax;
                    const participants = selectedBookingForInvoice.participants;

                    return (
                      <>
                        <p><strong>Days Stayed:</strong> {diffDays}</p>
                        <p><strong>Participants:</strong> {participants}</p>
                        <p><strong>Price per Day:</strong> ${pricePerDay.toFixed(2)}</p>
                        <hr />
                        <p><strong>Before Tax:</strong> ${beforeTax.toFixed(2)}</p>
                        <p><strong>Tax (27%):</strong> ${tax.toFixed(2)}</p>
                        <p className="total"><strong>Total:</strong> ${total.toFixed(2)}</p>
                      </>
                    );
                  })()}
                </div>
                <button 
                  onClick={() => setSelectedBookingForInvoice(null)}
                  className="close-button"
                >
                  Close
                </button>
              </>
            ) : (
              <p>Loading hotel details...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute('/BookingHistory')({
  component: BookingHistory,
});

export default BookingHistory;