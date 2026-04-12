import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Plane,
  AlertTriangle,
  Car,
  Ticket,
  ArrowUpFromLine,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { submitOutgoingRequest } from "../utils/visaStore";
import toast from "react-hot-toast";

const OUTGOING_SERVICES = [
  { value: "exit_visa", label: "Exit Visa", Icon: Ticket, desc: "Get your exit clearance" },
  { value: "overstay_help", label: "Overstay Assistance", Icon: AlertTriangle, desc: "Resolve overstay penalties" },
  { value: "airport_drop", label: "Airport Drop", Icon: Car, desc: "Transport to the airport" },
  { value: "flight_booking", label: "Flight Booking", Icon: Plane, desc: "Find & book your flight" },
];

const createInitialForm = () => ({
  departureDate: "",
  overstay: null,
  servicesNeeded: [],
  pickupLocation: "",
  phone: "",
  message: "",
});

const TOTAL_STEPS = 2;

export default function OutgoingServicesForm({ onBack }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(createInitialForm);

  const update = (field, value) => setForm((cur) => ({ ...cur, [field]: value }));

  const toggleService = (value) =>
    setForm((cur) => ({
      ...cur,
      servicesNeeded: cur.servicesNeeded.includes(value)
        ? cur.servicesNeeded.filter((s) => s !== value)
        : [...cur.servicesNeeded, value],
    }));

  const isStepComplete = (s) => {
    if (s === 1) return form.departureDate && form.servicesNeeded.length > 0;
    if (s === 2) return form.phone;
    return false;
  };

  const goNext = () => {
    if (step < TOTAL_STEPS) { setStep((s) => s + 1); toast.success("Step completed"); return; }
    setShowSummary(true); toast.success("Step completed");
  };

  const goBack = () => {
    if (showSummary) { setShowSummary(false); setStep(TOTAL_STEPS); return; }
    if (step === 1) { onBack(); return; }
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitOutgoingRequest(form, user);
      toast.success("Outgoing services request submitted!");
      navigate("/my-visa-requests");
    } catch (err) {
      toast.error(err.message || "Failed to submit. Please try again.");
    } finally { setSubmitting(false); }
  };

  const stepLabel = showSummary ? "Review" : `Step ${step}/${TOTAL_STEPS}`;
  const stepTitle = showSummary ? "Review your request" : ["Departure details", "Contact info"][step - 1];
  const serviceLabel = (val) => OUTGOING_SERVICES.find((s) => s.value === val)?.label || val;

  return (
    <div className="fade-in shell py-12 md:py-16">
      <section className="glass-panel mb-8 p-6 md:p-7">
        <div className="section-label mb-2">Outgoing Services</div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="page-title">Leaving Nepal?</h1>
            <p className="mt-1.5 text-slate-500">
              Exit visa, overstay resolution, airport transport, and flight booking — we'll help you depart smoothly.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 shadow-sm">
            <ArrowUpFromLine size={16} className="text-amber-500" />
            <span className="font-semibold">Departure support</span>
          </div>
        </div>
      </section>

      <button onClick={onBack} className="mb-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
        ← All services
      </button>

      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-5 shadow-sm md:p-7">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-600">{stepLabel}</div>
            <h2 className="mt-1 text-2xl font-display font-bold text-nepal-dark">{stepTitle}</h2>
            {!showSummary && (
              <div className="mt-3 flex items-center gap-1.5">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                  <div key={i} className={`h-1.5 w-8 rounded-full ${i + 1 <= step ? "bg-amber-500" : "bg-slate-200"}`} />
                ))}
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-4 py-3 text-right shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Account</div>
            <div className="mt-1 text-sm font-semibold text-nepal-dark">{user?.full_name || "Learner"}</div>
            <div className="text-xs text-slate-400">{user?.country}</div>
          </div>
        </div>

        {/* Step 1 */}
        {!showSummary && step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">Departure date</label>
              <input type="date" value={form.departureDate} onChange={(e) => update("departureDate", e.target.value)} className="input-field" />
            </div>

            <div>
              <div className="mb-3 text-sm font-semibold text-nepal-dark">Have you overstayed your visa?</div>
              <div className="grid grid-cols-2 gap-3">
                {[{ value: true, label: "Yes" }, { value: false, label: "No" }].map(({ value, label }) => (
                  <label key={String(value)} className={`cursor-pointer rounded-2xl border px-4 py-3 text-center text-sm font-semibold transition ${form.overstay === value ? "border-amber-300 bg-amber-50 text-nepal-dark shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>
                    <input type="radio" name="overstay" checked={form.overstay === value} onChange={() => update("overstay", value)} className="sr-only" />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 text-sm font-semibold text-nepal-dark">
                Services you need <span className="ml-1 font-normal text-slate-400">(select all that apply)</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {OUTGOING_SERVICES.map(({ value, label, Icon, desc }) => (
                  <label key={value} className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-4 transition ${form.servicesNeeded.includes(value) ? "border-amber-300 bg-amber-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}>
                    <input type="checkbox" checked={form.servicesNeeded.includes(value)} onChange={() => toggleService(value)} className="mt-1" />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <Icon size={14} className={form.servicesNeeded.includes(value) ? "text-amber-600" : "text-slate-500"} />
                        <span className="text-sm font-semibold text-nepal-dark">{label}</span>
                      </div>
                      <div className="text-xs text-slate-500">{desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {!showSummary && step === 2 && (
          <div className="mx-auto max-w-lg space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">
                Pickup location <span className="font-normal text-slate-400">(optional, for airport drop)</span>
              </label>
              <input type="text" value={form.pickupLocation} onChange={(e) => update("pickupLocation", e.target.value)} placeholder="e.g. Hotel Yak & Yeti, Durbar Marg" className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">
                Phone number <span className="font-normal text-slate-400">(with country code)</span>
              </label>
              <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+977-9812345678" required className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">
                Additional message <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <textarea value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Any specific details or questions" rows={3} className="input-field resize-none" />
            </div>
          </div>
        )}

        {/* Summary */}
        {showSummary && (
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Departure date", value: form.departureDate },
              { label: "Overstay", value: form.overstay === null ? "—" : form.overstay ? "Yes" : "No" },
              { label: "Services needed", value: form.servicesNeeded.map(serviceLabel).join(", ") },
              { label: "Pickup location", value: form.pickupLocation || "Not specified" },
              { label: "Phone", value: form.phone },
              { label: "Message", value: form.message || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
                <div className="mt-1 text-sm font-semibold text-nepal-dark capitalize">{value || "—"}</div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <button onClick={goBack} className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-nepal-dark transition hover:bg-slate-100">
            {step === 1 && !showSummary ? "← All services" : "Back"}
          </button>
          {showSummary ? (
            <button onClick={handleSubmit} disabled={submitting} className="cursor-pointer rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-amber-700 hover:to-orange-600 disabled:opacity-60">
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting…
                </span>
              ) : "Submit Request"}
            </button>
          ) : (
            isStepComplete(step) && (
              <button onClick={goNext} className="cursor-pointer rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-amber-700 hover:to-orange-600">
                {step === TOTAL_STEPS ? "Review & Submit" : "Continue"}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
