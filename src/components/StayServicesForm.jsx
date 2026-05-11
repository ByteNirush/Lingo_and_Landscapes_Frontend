import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, RefreshCw, Smartphone, Languages, Compass } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { submitStayRequest } from "../utils/visaStore";
import toast from "react-hot-toast";

const VISA_TYPE_OPTIONS = [
  { value: "tourist", label: "Tourist Visa" },
  { value: "business", label: "Business Visa" },
  { value: "study", label: "Study Visa" },
  { value: "work", label: "Work Visa" },
  { value: "diplomatic", label: "Diplomatic Visa" },
  { value: "other", label: "Other" },
];

const STAY_SERVICES = [
  { value: "visa_extension", label: "Visa Extension", Icon: RefreshCw, desc: "Extend your current visa stay" },
  { value: "travel_support", label: "Travel Support", Icon: Compass, desc: "Internal travel planning & permits" },
  { value: "sim_card", label: "SIM Card Assistance", Icon: Smartphone, desc: "Get a local SIM card set up" },
  { value: "translator", label: "Translator / Interpreter", Icon: Languages, desc: "Nepali–English translation help" },
];

const createInitialForm = () => ({
  currentVisaType: "",
  visaExpiryDate: "",
  servicesNeeded: [],
  currentLocation: "",
  phone: "",
  message: "",
});

const TOTAL_STEPS = 2;

export default function StayServicesForm({ onBack }) {
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
    if (s === 1) return form.currentVisaType && form.visaExpiryDate && form.servicesNeeded.length > 0;
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
      await submitStayRequest(form, user);
      toast.success("Stay services request submitted!");
      navigate("/my-visa-requests");
    } catch (err) {
      toast.error(err.message || "Failed to submit. Please try again.");
    } finally { setSubmitting(false); }
  };

  const stepLabel = showSummary ? "Review" : `Step ${step}/${TOTAL_STEPS}`;
  const stepTitle = showSummary ? "Review your request" : ["Service details", "Contact info"][step - 1];
  const serviceLabel = (val) => STAY_SERVICES.find((s) => s.value === val)?.label || val;
  const visaLabel = (val) => VISA_TYPE_OPTIONS.find((v) => v.value === val)?.label || val;

  return (
    <div className="fade-in shell py-12 md:py-16">
      <section className="glass-panel mb-8 p-6 md:p-7">
        <div className="section-label mb-2">Stay Services</div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="page-title">Already in Nepal?</h1>
            <p className="mt-1.5 text-slate-500">
              Visa extension, travel support, SIM cards, translation — we've got you covered while you're here.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
            <MapPin size={16} className="text-emerald-500" />
            <span className="font-semibold">In-country support</span>
          </div>
        </div>
      </section>

      <button onClick={onBack} className="mb-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
        ← All services
      </button>

      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-5 shadow-sm md:p-7">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">{stepLabel}</div>
            <h2 className="mt-1 text-2xl font-display font-bold text-nepal-dark">{stepTitle}</h2>
            {!showSummary && (
              <div className="mt-3 flex items-center gap-1.5">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                  <div key={i} className={`h-1.5 w-8 rounded-full ${i + 1 <= step ? "bg-emerald-500" : "bg-slate-200"}`} />
                ))}
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 px-4 py-3 text-right shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Account</div>
            <div className="mt-1 text-sm font-semibold text-nepal-dark">{user?.full_name || "Learner"}</div>
            <div className="text-xs text-slate-400">{user?.country}</div>
          </div>
        </div>

        {/* Step 1 */}
        {!showSummary && step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">Your current visa type</label>
              <select value={form.currentVisaType} onChange={(e) => update("currentVisaType", e.target.value)} className="input-field">
                <option value="">Select visa type</option>
                {VISA_TYPE_OPTIONS.map(({ value, label }) => (<option key={value} value={value}>{label}</option>))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">Visa expiry date</label>
              <input type="date" value={form.visaExpiryDate} onChange={(e) => update("visaExpiryDate", e.target.value)} className="input-field" />
            </div>
            <div>
              <div className="mb-3 text-sm font-semibold text-nepal-dark">
                Services you need <span className="ml-1 font-normal text-slate-400">(select all that apply)</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {STAY_SERVICES.map(({ value, label, Icon, desc }) => (
                  <label key={value} className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-4 transition ${form.servicesNeeded.includes(value) ? "border-emerald-300 bg-emerald-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}>
                    <input type="checkbox" checked={form.servicesNeeded.includes(value)} onChange={() => toggleService(value)} className="mt-1" />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <Icon size={14} className={form.servicesNeeded.includes(value) ? "text-emerald-600" : "text-slate-500"} />
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
                Current location in Nepal <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input type="text" value={form.currentLocation} onChange={(e) => update("currentLocation", e.target.value)} placeholder="e.g. Thamel, Kathmandu" className="input-field" />
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
              { label: "Current visa", value: visaLabel(form.currentVisaType) },
              { label: "Visa expiry", value: form.visaExpiryDate },
              { label: "Services needed", value: form.servicesNeeded.map(serviceLabel).join(", ") },
              { label: "Current location", value: form.currentLocation || "Not specified" },
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
            <button onClick={handleSubmit} disabled={submitting} className="cursor-pointer rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-teal-600 disabled:opacity-60">
              {submitting ? (
                <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Submitting…</span>
              ) : "Submit Request"}
            </button>
          ) : (
            isStepComplete(step) && (
              <button onClick={goNext} className="cursor-pointer rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-teal-600">
                {step === TOTAL_STEPS ? "Review & Submit" : "Continue"}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
