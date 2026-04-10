import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  Inbox,
  MessageSquareText,
  CheckCircle2,
} from "lucide-react";
import BookingCard from "../components/BookingCard";
import { useAuth } from "../context/AuthContext";
import { formatLongDate } from "../utils/date";
import { getUserBookings, getUserRequests } from "../utils/demoWorkflowStore";

const RequestCard = ({ request }) => {
  const statusStyles = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-sky-100 text-sky-800",
    scheduled: "bg-emerald-100 text-emerald-800",
  };

  return (
    <div className="card group cursor-pointer hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="section-label mb-2">Demo request</div>
          <div className="text-lg font-display font-bold text-nepal-dark">
            {request.goal}
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Clock3 size={14} className="text-slate-400" aria-hidden="true" />
              <span>{formatLongDate(request.preferredDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquareText
                size={14}
                className="text-slate-400"
                aria-hidden="true"
              />
              <span>{request.duration}</span>
            </div>
          </div>
        </div>

        <span
          className={`badge-booked ${statusStyles[request.status] || statusStyles.pending}`}
        >
          {request.status}
        </span>
      </div>

      <div className="mt-4 text-xs text-slate-400">
        Requested on {formatLongDate(request.createdAt)}
      </div>
    </div>
  );
};

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      setBookings(getUserBookings(user));
      setRequests(getUserRequests(user));
      setLoading(false);
    };

    load();

    const handleWorkflowUpdate = () => load();
    window.addEventListener("demo-workflow-updated", handleWorkflowUpdate);
    return () =>
      window.removeEventListener("demo-workflow-updated", handleWorkflowUpdate);
  }, [user]);

  const pendingRequests = requests.filter(
    (request) => request.status !== "scheduled",
  );
  const confirmedBookings = bookings.filter(Boolean);

  return (
    <div className="fade-in shell py-12 md:py-16">
      <div className="glass-panel mb-8 p-6 md:p-7">
        <div className="section-label mb-2">Your Demo Journey</div>
        <h1 className="page-title">My Requests & Sessions</h1>
        <p className="mt-1.5 text-slate-500">
          {loading
            ? "Loading your demo journey..."
            : `${pendingRequests.length} request${pendingRequests.length !== 1 ? "s" : ""} waiting · ${confirmedBookings.length} session${confirmedBookings.length !== 1 ? "s" : ""} confirmed`}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="mb-4 h-3 w-24 rounded bg-black/10" />
              <div className="mb-2 h-5 w-3/4 rounded bg-black/10" />
              <div className="h-4 bg-black/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : pendingRequests.length === 0 && confirmedBookings.length === 0 ? (
        <div className="card-soft py-24 text-center">
          <div className="mb-4 flex justify-center text-slate-400">
            <Inbox size={42} aria-hidden="true" />
          </div>
          <h2 className="mb-2 text-xl font-display font-bold text-nepal-dark">
            No demo requests yet
          </h2>
          <p className="mb-6 text-sm text-slate-500">
            Request a demo class and track the tutor review here.
          </p>
          <Link
            to="/slots"
            className="btn-primary inline-flex items-center gap-2"
          >
            Request Demo Class
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {pendingRequests.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <MessageSquareText size={18} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-nepal-dark">
                    Pending requests
                  </h2>
                  <p className="text-sm text-slate-500">
                    Your demo class request is waiting for tutor review.
                  </p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pendingRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            </section>
          )}

          {confirmedBookings.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={18} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-nepal-dark">
                    Confirmed sessions
                  </h2>
                  <p className="text-sm text-slate-500">
                    These are the slots assigned by the tutor.
                  </p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {confirmedBookings.map((booking) => (
                  <BookingCard
                    key={booking.id ?? booking._id}
                    booking={booking}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
