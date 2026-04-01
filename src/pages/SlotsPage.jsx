import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import SlotCard from '../components/SlotCard';

export default function SlotsPage() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'available' | 'booked'

  const fetchSlots = async () => {
    try {
      const { data } = await api.get('/slots');
      setSlots(data.slots);
    } catch {
      toast.error('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlots(); }, []);

  const handleBook = async (slotId) => {
    setBookingId(slotId);
    try {
      await api.post('/bookings', { slotId });
      toast.success('🎉 Slot booked! Check My Bookings for your Meet link.');
      fetchSlots();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingId(null);
    }
  };

  const filtered = slots.filter((s) => {
    if (filter === 'available') return !s.isBooked;
    if (filter === 'booked') return s.isBooked;
    return true;
  });

  const available = slots.filter((s) => !s.isBooked).length;

  return (
    <div className="fade-in shell py-10">
      <section className="glass-panel mb-8 p-6 md:p-7">
        <div className="section-label mb-2">Available Sessions</div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="page-title">Book a Class</h1>
            <p className="mt-1.5 text-slate-500">
              {loading ? 'Loading slots...' : `${available} slot${available !== 1 ? 's' : ''} ready to book`}
            </p>
          </div>

          <div className="self-start rounded-xl border border-slate-200 bg-white p-1 shadow-sm sm:self-auto">
            <div className="flex gap-1">
              {['all', 'available', 'booked'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition ${filter === f ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-nepal-dark'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="mb-4 h-3 w-24 rounded bg-black/10" />
              <div className="mb-2 h-5 w-3/4 rounded bg-black/10" />
              <div className="h-4 bg-black/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-soft py-24 text-center">
          <div className="text-5xl mb-4">📅</div>
          <h2 className="mb-2 text-xl font-display font-bold text-nepal-dark">
            {filter === 'available' ? 'No available slots right now' : 'No slots found'}
          </h2>
          <p className="text-sm text-slate-500">Check back later or contact your instructor.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((slot) => (
            <SlotCard
              key={slot._id}
              slot={slot}
              onBook={!slot.isBooked ? handleBook : null}
              booking={bookingId === slot._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
