import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Inbox,
  Users,
} from "lucide-react";
import {
  getAdminDashboardStats,
  getAdminRequests,
  getAdminSlots,
} from "../utils/adminApi";
import { formatShortDateTime } from "../utils/date";
import { mapApiError } from "../utils/errorMapper";

const StatCard = ({ icon, label, value, to, color, helper }) => (
  <Link
    to={to}
    className="card block group hover:-translate-y-1 hover:shadow-lg"
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="section-label mb-2">{label}</div>
        <div className="text-4xl font-display font-bold text-nepal-dark">
          {value ?? "—"}
        </div>
      </div>
      <div className={`rounded-2xl p-3 text-3xl ${color}`}>{icon}</div>
    </div>
    {helper && <div className="mt-3 text-sm text-slate-500">{helper}</div>}
    <div className="mt-4 text-xs font-semibold text-crimson-500 group-hover:underline">
      View details →
    </div>
  </Link>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: null,
    requests: null,
    pendingRequests: null,
    approvedRequests: null,
    slots: null,
    bookings: null,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentSlots, setRecentSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [nextStats, requests, slots] = await Promise.all([
          getAdminDashboardStats(),
          getAdminRequests(),
          getAdminSlots(),
        ]);
        setStats(nextStats);
        setRecentRequests(requests.slice(0, 3));
        setRecentSlots(slots.slice(0, 4));
      } catch (error) {
        toast.error(mapApiError(error, "Failed to load dashboard stats"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="fade-in shell py-12 md:py-16">
      <section className="relative overflow-hidden rounded-4xl border border-slate-200/80 bg-linear-to-br from-slate-950 via-slate-900 to-crimson-950 p-6 text-white shadow-[0_24px_80px_-28px_rgba(15,23,42,0.65)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(248,113,113,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.16),transparent_30%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
              Admin Console
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
              Platform dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
              Track users, bookings, and slot availability from a clean command
              center built for fast admin work.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-300">
                Current focus
              </div>
              <div className="mt-2 text-xl font-display font-bold">
                Operations overview
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-300">
                Quick win
              </div>
              <div className="mt-2 text-xl font-display font-bold">
                Create next slot
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Users size={28} aria-hidden="true" />}
          label="Total Users"
          value={loading ? "—" : stats.users}
          to="/admin/users"
          color="bg-blue-50"
          helper="Registered learner accounts"
        />
        <StatCard
          icon={<Inbox size={28} aria-hidden="true" />}
          label="Demo Requests"
          value={loading ? "—" : stats.requests}
          to="/admin/bookings"
          color="bg-amber-50"
          helper="Learner requests waiting in the queue"
        />
        <StatCard
          icon={<CheckCircle2 size={28} aria-hidden="true" />}
          label="Approved Requests"
          value={loading ? "—" : stats.approvedRequests}
          to="/admin/bookings"
          color="bg-emerald-50"
          helper="Ready to be converted into slots"
        />
        <StatCard
          icon={<CircleDot size={28} aria-hidden="true" />}
          label="Created Slots"
          value={loading ? "—" : stats.slots}
          to="/admin/slots"
          color="bg-crimson-50"
          helper="Google Meet sessions sent to learners"
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="card-soft border-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="section-label mb-2">Quick Actions</div>
              <h2 className="text-2xl font-display font-bold text-nepal-dark">
                Management shortcuts
              </h2>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/admin/slots" className="btn-primary">
              + Create Demo Slot
            </Link>
            <Link to="/admin/bookings" className="btn-secondary">
              Review Requests
            </Link>
            <Link
              to="/admin/users"
              className="btn-ghost border border-black/10"
            >
              Manage Users
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-nepal-dark">
                Booking ratio
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div className="h-2 w-[68%] rounded-full bg-linear-to-r from-crimson-500 to-orange-400" />
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Approximate requests already approved
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-nepal-dark">
                Availability
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div className="h-2 w-[42%] rounded-full bg-linear-to-r from-emerald-500 to-teal-400" />
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Slots created and delivered to learners
              </div>
            </div>
          </div>
        </div>

        <div className="card-soft border-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="section-label mb-2">Recent Activity</div>
              <h2 className="text-2xl font-display font-bold text-nepal-dark">
                Latest requests and slots
              </h2>
            </div>
            <Link to="/admin/bookings" className="btn-ghost">
              See all
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="space-y-3">
                <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
              </div>
            ) : recentRequests.length > 0 ? (
              recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-nepal-dark">
                        {request.user?.name ||
                          request.user?.full_name ||
                          "Learner"}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {request.preferredDate
                          ? formatShortDateTime(request.preferredDate)
                          : "Demo request"}
                      </div>
                    </div>
                    <Link
                      to="/admin/bookings"
                      className="text-xs font-semibold text-crimson-500 hover:underline"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center">
                <div className="flex justify-center text-slate-400">
                  <Inbox size={34} aria-hidden="true" />
                </div>
                <p className="mt-3 text-sm text-slate-500">
                  No demo requests have been created yet.
                </p>
              </div>
            )}

            <div className="pt-2">
              <div className="section-label mb-3">Created demo slots</div>
              <div className="space-y-3">
                {loading ? (
                  <div className="space-y-3">
                    <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                    <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                  </div>
                ) : recentSlots.length > 0 ? (
                  recentSlots.map((slot) => (
                    <div
                      key={slot.id ?? slot._id}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <div>
                        <div className="text-sm font-semibold text-nepal-dark">
                          {formatShortDateTime(slot.date)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {slot.time}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold ${slot.isBooked ? "text-rose-600" : "text-emerald-600"}`}
                      >
                        {slot.isBooked ? "Booked" : "Open"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-500">
                    No slots available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
