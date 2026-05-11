import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  X,
  Clock3,
  ClipboardList,
  DollarSign,
  MessageSquareText,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { formatLongDate } from "../utils/date";
import {
  getAdminRequests,
  reviewDemoRequest,
} from "../utils/demoWorkflowStore";

const statusStyles = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-sky-100 text-sky-800",
  scheduled: "bg-emerald-100 text-emerald-800",
};

const statusLabels = {
  pending: "Pending",
  approved: "Approved",
  scheduled: "Scheduled",
};

const getRequestCardId = (request, sectionKey, index) => {
  const rawId = request?.id ?? request?._id;
  const hasValidId =
    rawId !== null && rawId !== undefined && String(rawId).trim().length > 0;

  if (hasValidId) return String(rawId);

  const email = request?.user?.email || "unknown";
  const createdAt = request?.createdAt || "na";
  const preferredDate = request?.preferredDate || "na";
  return `${sectionKey}-${email}-${createdAt}-${preferredDate}-${index}`;
};

const RequestCard = ({ request, cardId, onReview, onOpenDetails }) => {
  return (
    <div className="card group cursor-pointer hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="section-label mb-2">Demo request</div>
          <div className="text-lg font-display font-bold text-nepal-dark">
            {request.user?.name || request.user?.full_name || "Learner"}
          </div>
          <div className="mt-1 text-sm text-slate-500">
            {request.user?.email || "No email"}
          </div>

          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Clock3 size={14} className="text-slate-400" aria-hidden="true" />
              <span>
                {formatLongDate(request.preferredDate)} · {request.duration}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquareText
                size={14}
                className="text-slate-400"
                aria-hidden="true"
              />
              <span>{request.goal}</span>
            </div>
          </div>
        </div>

        <span
          className={`badge-booked ${statusStyles[request.status] || statusStyles.pending}`}
        >
          {statusLabels[request.status] || "Pending"}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-400">
          Requested on {formatLongDate(request.createdAt)}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenDetails(cardId)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            View details
          </button>

          {request.status === "pending" ? (
            <button
              onClick={() => onReview(request.id)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-crimson-50 px-3.5 py-2 text-xs font-semibold text-crimson-600 transition hover:bg-crimson-100"
            >
              <CheckCircle2 size={14} aria-hidden="true" />
              Approve request
            </button>
          ) : request.status === "approved" ? (
            <Link
              to="/admin/slots"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-sky-50 px-3.5 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
            >
              Create slot
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          ) : (
            <span className="text-xs font-semibold text-emerald-700">
              Slot created and sent to learner
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const RequestDetailsModal = ({ request, onClose }) => {
  if (!request) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/45 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="section-label mb-1">Demo request details</div>
            <h3 className="text-xl font-display font-bold text-nepal-dark">
              {request.user?.name || request.user?.full_name || "Learner"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {request.user?.email || "No email"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex cursor-pointer items-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
            aria-label="Close details"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Goal
            </div>
            <div className="text-sm font-semibold text-nepal-dark">
              {request.goal || "Not provided"}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Requested on
            </div>
            <div className="text-sm font-semibold text-nepal-dark">
              {formatLongDate(request.createdAt)}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Preferred date
            </div>
            <div className="text-sm font-semibold text-nepal-dark">
              {request.preferredDate
                ? formatLongDate(request.preferredDate)
                : "Not provided"}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Session duration
            </div>
            <div className="text-sm font-semibold text-nepal-dark">
              {request.duration || "Not provided"}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Level
            </div>
            <div className="text-sm font-semibold text-nepal-dark">
              {request.level || "Not provided"}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Experience
            </div>
            <div className="text-sm font-semibold text-nepal-dark">
              {request.experience || "Not provided"}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Availability windows
            </div>
            <div className="text-sm font-semibold text-nepal-dark">
              {request.availabilityWindows?.length
                ? request.availabilityWindows.join(", ")
                : "Not provided"}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Availability days
            </div>
            <div className="text-sm font-semibold text-nepal-dark">
              {request.availabilityDays?.length
                ? request.availabilityDays.join(", ")
                : "Not provided"}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Learning focus
          </div>
          <div className="mt-1 flex flex-wrap gap-2">
            {request.focus?.length ? (
              request.focus.map((focusItem) => (
                <span
                  key={focusItem}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
                >
                  {focusItem}
                </span>
              ))
            ) : (
              <span className="text-sm font-semibold text-nepal-dark">
                Not provided
              </span>
            )}
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-nepal-dark">
          <DollarSign size={14} className="text-slate-500" aria-hidden="true" />
          Budget: ${request.budget ?? "N/A"}
        </div>
      </div>
    </div>
  );
};

export default function AdminBookings() {
  const [requests, setRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const data = await getAdminRequests();
      setRequests(data);
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleReview = async (requestId) => {
    try {
      await reviewDemoRequest(requestId);
      toast.success("Request approved for slot creation");
      fetchRequests();
    } catch (err) {
      toast.error("Failed to approve request");
    }
  };

  const handleOpenDetails = (requestId) => {
    setSelectedRequestId(requestId);
  };

  const handleCloseDetails = () => {
    setSelectedRequestId(null);
  };

  const selectedRequest = requests.find((request, index) => {
    const section = request.status || "pending";
    return getRequestCardId(request, section, index) === selectedRequestId;
  });

  const pending = requests.filter((request) => request.status === "pending");
  const approved = requests.filter((request) => request.status === "approved");
  const scheduled = requests.filter(
    (request) => request.status === "scheduled",
  );

  return (
    <div className="fade-in shell py-12 md:py-16">
      <div className="glass-panel mb-8 p-6 md:p-7">
        <div className="section-label mb-2">Admin · Demo Requests</div>
        <h1 className="page-title">Review Requests</h1>
        <p className="mt-1.5 text-slate-500">
          {loading
            ? "Loading demo requests..."
            : `${requests.length} request${requests.length !== 1 ? "s" : ""} total · ${pending.length} pending · ${approved.length} approved · ${scheduled.length} scheduled`}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse h-48" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="card-soft py-20 text-center">
          <div className="mb-3 flex justify-center text-slate-400">
            <ClipboardList size={34} aria-hidden="true" />
          </div>
          <p className="text-slate-500">No demo requests yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {pending.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-display font-bold text-nepal-dark">
                  Pending review
                </h2>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  {pending.length}
                </span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pending.map((request, index) => {
                  const cardId = getRequestCardId(request, "pending", index);
                  return (
                    <RequestCard
                      key={cardId}
                      request={request}
                      cardId={cardId}
                      onReview={handleReview}
                      onOpenDetails={handleOpenDetails}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {approved.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-display font-bold text-nepal-dark">
                  Ready for slot creation
                </h2>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
                  {approved.length}
                </span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {approved.map((request, index) => {
                  const cardId = getRequestCardId(request, "approved", index);
                  return (
                    <RequestCard
                      key={cardId}
                      request={request}
                      cardId={cardId}
                      onReview={handleReview}
                      onOpenDetails={handleOpenDetails}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {scheduled.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-display font-bold text-nepal-dark">
                  Scheduled requests
                </h2>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  {scheduled.length}
                </span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {scheduled.map((request, index) => {
                  const cardId = getRequestCardId(request, "scheduled", index);
                  return (
                    <RequestCard
                      key={cardId}
                      request={request}
                      cardId={cardId}
                      onReview={handleReview}
                      onOpenDetails={handleOpenDetails}
                    />
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}

      <RequestDetailsModal
        request={selectedRequest}
        onClose={handleCloseDetails}
      />
    </div>
  );
}
