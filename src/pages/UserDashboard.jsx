import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import { formatLongDate } from '../utils/date';
import { mapApiError } from '../utils/errorMapper';

const StatCard = ({ label, value, detail, tone }) => (
  <div className="card-soft relative overflow-hidden">
    <div className={`absolute inset-x-0 top-0 h-1 ${tone}`} />
    <div className="section-label mb-3">{label}</div>
    <div className="text-4xl font-display font-bold text-nepal-dark">{value}</div>
    <div className="mt-2 text-sm leading-relaxed text-slate-500">{detail}</div>
  </div>
);

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [bookingsResponse, slotsResponse] = await Promise.all([
          api.get('/bookings/my'),
          api.get('/slots'),
        ]);

        setBookings(bookingsResponse.data?.bookings ?? []);
        setAvailableSlots((slotsResponse.data?.slots ?? []).filter((slot) => !slot.isBooked));
      } catch (error) {
        toast.error(mapApiError(error, 'Failed to load dashboard'));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const sortedBookings = [...bookings].sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt));
  const nextBooking = sortedBookings[0] ?? null;
  const recentBookings = sortedBookings.slice(0, 3);
  const learningPace = bookings.length === 0 ? 'Just getting started' : bookings.length < 3 ? 'Building momentum' : 'Strong consistency';
  const nextSessionLabel = nextBooking?.slot?.date ? formatLongDate(nextBooking.slot.date) : 'No upcoming session';

  return (
    <div className="fade-in shell py-12 md:py-16">
      <section
        className="relative overflow-hidden rounded-[28px] border border-slate-200/80 p-6 text-white shadow-[0_24px_80px_-28px_rgba(15,23,42,0.65)] md:p-8"
        style={{
          backgroundImage:
            'linear-gradient(to bottom right, rgba(2, 6, 23, 0.96), rgba(15, 23, 42, 0.94) 55%, rgba(127, 29, 29, 0.88)), radial-gradient(circle at top right, rgba(248, 113, 113, 0.2), transparent 35%), radial-gradient(circle at bottom left, rgba(56, 189, 248, 0.18), transparent 30%)',
        }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
              Learner Dashboard
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
              Welcome back, {user?.full_name || user?.name || 'Learner'}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
              Track your sessions, check your next booking, and jump straight back into learning.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/slots" className="btn-primary bg-white text-slate-950 hover:bg-slate-100 hover:from-white hover:to-slate-100">
                Browse New Slots
              </Link>
              <Link to="/my-bookings" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/15">
                View My Bookings
              </Link>
            </div>
          </div>

          <div className="card-soft border-white/10 bg-white/10 p-5 text-white backdrop-blur-xl">
            <div className="section-label text-crimson-300">Next Session</div>
            {loading ? (
              <div className="mt-5 space-y-3 animate-pulse">
                <div className="h-4 w-1/2 rounded bg-white/15" />
                <div className="h-6 w-3/4 rounded bg-white/15" />
                <div className="h-4 w-2/3 rounded bg-white/15" />
              </div>
            ) : nextBooking ? (
              <>
                <div className="mt-4 text-3xl font-display font-bold">{nextSessionLabel}</div>
                <div className="mt-3 text-sm text-slate-200">{nextBooking.slot?.time}</div>
                <div className="mt-3 text-sm leading-relaxed text-slate-300">
                  {nextBooking.slot?.description || 'A private live session is ready for you.'}
                </div>
              </>
            ) : (
              <>
                <div className="mt-4 text-3xl font-display font-bold">No booking yet</div>
                <div className="mt-3 text-sm leading-relaxed text-slate-300">
                  Book a slot to lock in your next Nepali lesson and get into a steady rhythm.
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
        <StatCard
          label="My Bookings"
          value={loading ? '—' : bookings.length}
          detail="Total confirmed sessions across your account."
          tone="bg-linear-to-r from-crimson-500 to-crimson-600"
        />
        <StatCard
          label="Available Slots"
          value={loading ? '—' : availableSlots.length}
          detail="Open lessons ready to reserve right now."
          tone="bg-linear-to-r from-sky-500 to-cyan-500"
        />
        <StatCard
          label="Learning Pace"
          value={loading ? '—' : learningPace}
          detail="A quick snapshot of your recent booking rhythm."
          tone="bg-linear-to-r from-emerald-500 to-teal-500"
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="section-label mb-2">Recent Bookings</div>
              <h2 className="text-2xl font-display font-bold text-nepal-dark">Your latest sessions</h2>
            </div>
            <Link to="/my-bookings" className="btn-ghost">
              See all
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="space-y-4">
                <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
              </div>
            ) : recentBookings.length > 0 ? (
              recentBookings.map((booking) => <BookingCard key={booking.id ?? booking._id} booking={booking} />)
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center">
                <div className="text-4xl">🗓️</div>
                <p className="mt-3 text-sm text-slate-500">No bookings yet. Reserve a slot to start your dashboard history.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="section-label mb-3">Recommended Next Step</div>
            <h3 className="text-2xl font-display font-bold text-nepal-dark">Keep your momentum going</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Consistent booking patterns are the fastest way to improve fluency. Reserve your next class before the week fills up.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/slots" className="btn-primary">
                Book another class
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn more about us
              </Link>
            </div>
          </div>

          <div className="card-soft">
            <div className="section-label mb-3">Account Summary</div>
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <span>Name</span>
                <span className="font-semibold text-nepal-dark">{user?.full_name || user?.name || 'Learner'}</span>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <span>Email</span>
                <span className="font-semibold text-nepal-dark">{user?.email || '—'}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Progress focus</span>
                <span className="font-semibold text-nepal-dark">Live conversations</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
