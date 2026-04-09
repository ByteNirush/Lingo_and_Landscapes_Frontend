import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import BookingCard from '../components/BookingCard';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/bookings/my');
        setBookings(data.bookings);
      } catch {
        toast.error('Failed to load your bookings');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="fade-in shell py-12 md:py-16">
      <div className="glass-panel mb-8 p-6 md:p-7">
        <div className="section-label mb-2">Your Schedule</div>
        <h1 className="page-title">My Bookings</h1>
        <p className="mt-1.5 text-slate-500">
          {loading ? 'Loading your schedule...' : `${bookings.length} session${bookings.length !== 1 ? 's' : ''} booked`}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="mb-4 h-3 w-24 rounded bg-black/10" />
              <div className="mb-2 h-5 w-3/4 rounded bg-black/10" />
              <div className="h-4 bg-black/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="card-soft py-24 text-center">
          <div className="mb-4 text-5xl">📭</div>
          <h2 className="text-xl font-display font-bold text-nepal-dark mb-2">No bookings yet</h2>
          <p className="mb-6 text-sm text-slate-500">Browse available slots and reserve your first class.</p>
          <Link to="/slots" className="btn-primary inline-block">Browse Slots →</Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <BookingCard key={booking.id ?? booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
