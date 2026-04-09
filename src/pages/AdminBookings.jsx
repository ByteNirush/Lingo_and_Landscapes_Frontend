import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import BookingCard from '../components/BookingCard';
import { cancelAdminBooking, getAdminBookings } from '../utils/adminApi';
import { mapApiError } from '../utils/errorMapper';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const nextBookings = await getAdminBookings();
      setBookings(nextBookings);
    } catch (error) {
      toast.error(mapApiError(error, 'Failed to load bookings'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking and free the slot?')) return;
    try {
      await cancelAdminBooking(id);
      toast.success('Booking cancelled and slot freed');
      fetchBookings();
    } catch (error) {
      toast.error(mapApiError(error, 'Failed to cancel booking'));
    }
  };

  return (
    <div className="fade-in shell py-12 md:py-16">
      <div className="glass-panel mb-8 p-6 md:p-7">
        <div className="section-label mb-2">Admin · Bookings</div>
        <h1 className="page-title">All Bookings</h1>
        <p className="mt-1.5 text-slate-500">{loading ? 'Loading bookings...' : `${bookings.length} total booking${bookings.length !== 1 ? 's' : ''}`}</p>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <div key={i} className="card animate-pulse h-48" />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="card-soft py-20 text-center">
          <div className="mb-3 text-4xl">📋</div>
          <p className="text-slate-500">No bookings yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="relative group">
              <BookingCard booking={booking} showUser />
              <button
                onClick={() => handleCancel(booking.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-black/10 text-red-500 hover:bg-red-50 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
