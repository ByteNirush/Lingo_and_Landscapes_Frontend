import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock3,
  Globe,
  Inbox,
  MapPin,
  MessageSquareText,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatLongDate } from "../utils/date";
import { getUserVisaRequests } from "../utils/visaStore";

const statusStyles = {
  pending: "bg-amber-100 text-amber-800",
  reviewing: "bg-sky-100 text-sky-800",
  responded: "bg-purple-100 text-purple-800",
  completed: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

const SERVICE_META = {
  incoming: { label: "Incoming", badge: "bg-sky-100 text-sky-800", Icon: ArrowDownToLine },
  stay:     { label: "Stay",     badge: "bg-emerald-100 text-emerald-800", Icon: MapPin },
  outgoing: { label: "Outgoing", badge: "bg-amber-100 text-amber-800", Icon: ArrowUpFromLine },
};

const getCardTitle = (r) => {
  if (r.serviceType === "stay") return `${r.currentVisaType || "—"} visa · Stay services`;
  if (r.serviceType === "outgoing") return `Departure · ${r.servicesNeeded?.length || 0} services`;
  return `${r.visaType || "—"} visa · ${r.duration || "—"}`;
};

const getCardDetails = (r) => {
  if (r.serviceType === "stay") {
    return [
      { icon: Clock3, text: `Visa expires: ${formatLongDate(r.visaExpiryDate)}` },
      { icon: MapPin, text: r.currentLocation ? `Location: ${r.currentLocation}` : "Location: Not specified" },
    ];
  }
  if (r.serviceType === "outgoing") {
    return [
      { icon: Clock3, text: `Departure: ${formatLongDate(r.departureDate)}` },
      { icon: Globe, text: r.overstay ? "Overstay: Yes" : "Overstay: No" },
    ];
  }
  return [
    { icon: Clock3, text: `Arrival: ${formatLongDate(r.arrivalDate)}` },
    { icon: Globe, text: `Entry by ${r.entryMethod}` },
  ];
};

const VisaRequestCard = ({ request }) => {
  const type = request.serviceType || "incoming";
  const meta = SERVICE_META[type] || SERVICE_META.incoming;
  const MetaIcon = meta.Icon;

  return (
    <div className="card group hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <div className="section-label">Service request</div>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.badge}`}>
              <MetaIcon size={10} />
              {meta.label}
            </span>
          </div>
          <div className="text-lg font-display font-bold text-nepal-dark capitalize">
            {getCardTitle(request)}
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            {getCardDetails(request).map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon size={14} className="text-slate-400" aria-hidden="true" />
                <span>{text}</span>
              </div>
            ))}
            {request.purpose && (
              <div className="flex items-center gap-2">
                <MessageSquareText size={14} className="text-slate-400" aria-hidden="true" />
                <span className="truncate">{request.purpose}</span>
              </div>
            )}
          </div>

          {request.adminNote && (
            <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-800">
              <span className="font-semibold">Team note: </span>
              {request.adminNote}
            </div>
          )}
        </div>

        <span className={`badge-booked ${statusStyles[request.status] || statusStyles.pending}`}>
          {request.status}
        </span>
      </div>

      <div className="mt-4 text-xs text-slate-400">
        Submitted on {formatLongDate(request.createdAt)}
      </div>
    </div>
  );
};

export default function MyVisaRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const data = await getUserVisaRequests(user);
        setRequests(data);
      } catch (err) {
        console.error("Failed to load visa requests", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  return (
    <div className="fade-in shell py-12 md:py-16">
      <div className="glass-panel mb-8 p-6 md:p-7">
        <div className="section-label mb-2">Visa Services</div>
        <h1 className="page-title">My Visa Requests</h1>
        <p className="mt-1.5 text-slate-500">
          {loading
            ? "Loading your visa requests..."
            : `${requests.length} request${requests.length !== 1 ? "s" : ""} submitted`}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="mb-4 h-3 w-24 rounded bg-black/10" />
              <div className="mb-2 h-5 w-3/4 rounded bg-black/10" />
              <div className="h-4 w-1/2 rounded bg-black/5" />
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="card-soft py-24 text-center">
          <div className="mb-4 flex justify-center text-slate-400">
            <Inbox size={42} aria-hidden="true" />
          </div>
          <h2 className="mb-2 text-xl font-display font-bold text-nepal-dark">
            No visa requests yet
          </h2>
          <p className="mb-6 text-sm text-slate-500">
            Submit a visa assistance request and track its progress here.
          </p>
          <Link
            to="/visa-services"
            className="btn-primary inline-flex items-center gap-2"
          >
            Request Visa Help
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <VisaRequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}
