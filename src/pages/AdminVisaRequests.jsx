import { useEffect, useState } from "react";
import {
  Globe,
  Inbox,
  X,
  Clock3,
  FileText,
  CheckCircle2,
  RotateCcw,
  ArrowDownToLine,
  MapPin,
  ArrowUpFromLine,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatLongDate } from "../utils/date";
import {
  getAdminVisaRequests,
  updateVisaRequestStatus,
  deleteVisaRequest,
} from "../utils/visaStore";

const SERVICE_META = {
  incoming: { label: "Incoming", badge: "bg-sky-100 text-sky-800", Icon: ArrowDownToLine },
  stay:     { label: "Stay",     badge: "bg-emerald-100 text-emerald-800", Icon: MapPin },
  outgoing: { label: "Outgoing", badge: "bg-amber-100 text-amber-800", Icon: ArrowUpFromLine },
};

const SERVICE_FILTERS = [
  { value: "all", label: "All" },
  { value: "incoming", label: "Incoming" },
  { value: "stay", label: "Stay" },
  { value: "outgoing", label: "Outgoing" },
];

const statusStyles = {
  pending: "bg-amber-100 text-amber-800",
  reviewing: "bg-sky-100 text-sky-800",
  responded: "bg-purple-100 text-purple-800",
  completed: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "Pending",
  reviewing: "Reviewing",
  responded: "Responded",
  completed: "Completed",
  rejected: "Rejected",
};

const DOCUMENTS_LABELS = {
  passport: "Passport",
  photos: "Photos",
  flight_ticket: "Flight ticket",
  hotel_booking: "Hotel booking",
  travel_insurance: "Travel insurance",
  bank_statement: "Bank statement",
  invitation_letter: "Invitation letter",
};

const ALL_DOCUMENTS = Object.keys(DOCUMENTS_LABELS);

// ── Detail modal ──────────────────────────────────────────────
const VisaDetailModal = ({ request, onClose, onUpdateStatus }) => {
  const [note, setNote] = useState(request?.adminNote || "");
  const [saving, setSaving] = useState(false);

  if (!request) return null;

  const handleUpdate = async (status) => {
    setSaving(true);
    try {
      await onUpdateStatus(request.id, status, note);
      toast.success(`Status updated to "${statusLabels[status]}"`);
      onClose();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/45 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl md:p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="section-label mb-1">Visa request details</div>
            <h3 className="text-xl font-display font-bold text-nepal-dark">
              {request.fullName || "Applicant"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{request.email}</p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex cursor-pointer items-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Service type badge */}
        {(() => { const st = request.serviceType || "incoming"; const m = SERVICE_META[st] || SERVICE_META.incoming; const I = m.Icon; return (
          <div className="mb-4">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${m.badge}`}><I size={12} />{m.label}</span>
          </div>
        ); })()}

        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {[
            { label: "Nationality", value: request.nationality },
            { label: "Passport no.", value: request.passportNumber },
            { label: "Phone", value: request.phone },
            // incoming-specific
            ...((!request.serviceType || request.serviceType === "incoming") ? [
              { label: "Date of birth", value: request.dateOfBirth ? formatLongDate(request.dateOfBirth) : "—" },
              { label: "Passport expiry", value: request.passportExpiry ? formatLongDate(request.passportExpiry) : "—" },
              { label: "Visa type", value: request.visaType },
              { label: "Duration", value: request.duration },
              { label: "Arrival date", value: request.arrivalDate ? formatLongDate(request.arrivalDate) : "—" },
              { label: "Entry method", value: request.entryMethod },
              { label: "Visited before", value: request.visitedBefore ? "Yes" : "No" },
              { label: "Prior rejection", value: request.previousRejection ? "Yes" : "No" },
            ] : []),
            // stay-specific
            ...(request.serviceType === "stay" ? [
              { label: "Current visa", value: request.currentVisaType },
              { label: "Visa expiry", value: request.visaExpiryDate ? formatLongDate(request.visaExpiryDate) : "—" },
              { label: "Services needed", value: request.servicesNeeded?.join(", ") },
              { label: "Location", value: request.currentLocation || "—" },
            ] : []),
            // outgoing-specific
            ...(request.serviceType === "outgoing" ? [
              { label: "Departure date", value: request.departureDate ? formatLongDate(request.departureDate) : "—" },
              { label: "Overstay", value: request.overstay ? "Yes" : "No" },
              { label: "Services needed", value: request.servicesNeeded?.join(", ") },
              { label: "Pickup location", value: request.pickupLocation || "—" },
            ] : []),
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</div>
              <div className="text-sm font-semibold text-nepal-dark capitalize">{value || "—"}</div>
            </div>
          ))}
        </div>

        {request.purpose && (
          <div className="mb-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Purpose</div>
            <div className="mt-1 text-sm text-nepal-dark">{request.purpose}</div>
          </div>
        )}

        {/* Documents (only for incoming) */}
        {(!request.serviceType || request.serviceType === "incoming") && (
          <div className="mb-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Documents ready</div>
            <div className="flex flex-wrap gap-2">
              {ALL_DOCUMENTS.map((doc) => (
                <span key={doc} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${request.documentsReady?.includes(doc) ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-400 line-through"}`}>{DOCUMENTS_LABELS[doc]}</span>
              ))}
            </div>
          </div>
        )}

        {request.message && (
          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <span className="font-semibold">Message: </span>
            {request.message}
          </div>
        )}

        {/* Admin note + status update */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">
              Note to applicant
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Please submit your bank statement. We'll guide you through the rest."
              rows={3}
              className="input-field resize-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleUpdate("reviewing")}
              disabled={saving}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-sky-50 px-3.5 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100 disabled:opacity-60"
            >
              Mark reviewing
            </button>
            <button
              onClick={() => handleUpdate("responded")}
              disabled={saving}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-purple-50 px-3.5 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-100 disabled:opacity-60"
            >
              <CheckCircle2 size={14} aria-hidden="true" />
              Mark responded
            </button>
            <button
              onClick={() => handleUpdate("completed")}
              disabled={saving}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
            >
              Mark completed
            </button>
            <button
              onClick={() => handleUpdate("rejected")}
              disabled={saving}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Request card ──────────────────────────────────────────────
const getCardSubtitle = (r) => {
  if (r.serviceType === "stay") return `${r.currentVisaType || "—"} visa · Stay services`;
  if (r.serviceType === "outgoing") return `Departure · ${r.servicesNeeded?.length || 0} services`;
  return `${r.visaType || "—"} · ${r.duration || "—"}`;
};

const getCardDetail = (r) => {
  if (r.serviceType === "stay") return `Visa expires: ${formatLongDate(r.visaExpiryDate)}`;
  if (r.serviceType === "outgoing") return `Departure: ${formatLongDate(r.departureDate)}`;
  return `Arrival: ${formatLongDate(r.arrivalDate)}`;
};

const VisaRequestCard = ({ request, onOpen, onDelete }) => {
  const st = request.serviceType || "incoming";
  const meta = SERVICE_META[st] || SERVICE_META.incoming;
  const MetaIcon = meta.Icon;
  return (
    <div className="card group hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <div className="section-label">Service request</div>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.badge}`}><MetaIcon size={10} />{meta.label}</span>
          </div>
          <div className="text-lg font-display font-bold text-nepal-dark">{request.fullName || "Applicant"}</div>
          <div className="mt-1 text-sm text-slate-500">{request.email}</div>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-slate-400" aria-hidden="true" />
              <span className="capitalize">{getCardSubtitle(request)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock3 size={14} className="text-slate-400" aria-hidden="true" />
              <span>{getCardDetail(request)}</span>
            </div>
          </div>
        </div>
        <span className={`badge-booked ${statusStyles[request.status] || statusStyles.pending}`}>{statusLabels[request.status] || "Pending"}</span>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-400">Submitted {formatLongDate(request.createdAt)}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => onOpen(request)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">Review & respond</button>
          <button onClick={() => onDelete(request.id)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-100">Delete</button>
        </div>
      </div>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────
export default function AdminVisaRequests() {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");

  const fetchRequests = async () => {
    try {
      const data = await getAdminVisaRequests();
      setRequests(data);
    } catch (err) {
      console.error("Failed to load visa requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status, note) => {
    await updateVisaRequestStatus(id, status, note);
    fetchRequests();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this visa request?")) return;
    try {
      await deleteVisaRequest(id);
      toast.success("Request deleted");
      fetchRequests();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filtered = typeFilter === "all"
    ? requests
    : requests.filter((r) => (r.serviceType || "incoming") === typeFilter);

  const pending = filtered.filter((r) => r.status === "pending");
  const active = filtered.filter((r) =>
    ["reviewing", "responded"].includes(r.status),
  );
  const closed = filtered.filter((r) =>
    ["completed", "rejected"].includes(r.status),
  );

  return (
    <div className="fade-in shell py-12 md:py-16">
      <div className="glass-panel mb-8 p-6 md:p-7">
        <div className="section-label mb-2">Admin · Visa Services</div>
        <h1 className="page-title">Service Requests</h1>
        <p className="mt-1.5 text-slate-500">
          {loading
            ? "Loading requests..."
            : `${filtered.length} shown · ${pending.length} pending · ${active.length} active · ${closed.length} closed`}
        </p>
        {/* Service type filter tabs */}
        {!loading && (
          <div className="mt-4 flex flex-wrap gap-2">
            {SERVICE_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTypeFilter(value)}
                className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${typeFilter === value ? "bg-crimson-600 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                {label}
                {value !== "all" && (
                  <span className="ml-1.5 opacity-70">
                    {requests.filter((r) => (r.serviceType || "incoming") === value).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
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
            <Inbox size={34} aria-hidden="true" />
          </div>
          <p className="text-slate-500">No visa requests yet.</p>
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
                {pending.map((r) => (
                  <VisaRequestCard
                    key={r.id}
                    request={r}
                    onOpen={setSelected}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}

          {active.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-display font-bold text-nepal-dark">
                  In progress
                </h2>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
                  {active.length}
                </span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {active.map((r) => (
                  <VisaRequestCard
                    key={r.id}
                    request={r}
                    onOpen={setSelected}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}

          {closed.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-display font-bold text-nepal-dark">
                  Closed
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {closed.length}
                </span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {closed.map((r) => (
                  <VisaRequestCard
                    key={r.id}
                    request={r}
                    onOpen={setSelected}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <VisaDetailModal
        request={selected}
        onClose={() => setSelected(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
