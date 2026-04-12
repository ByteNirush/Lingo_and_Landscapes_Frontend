import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  Plane,
  Briefcase,
  BookOpen,
  Users,
  MapPin,
  ArrowUpFromLine,
  PlaneLanding,
  MapPinned,
  PlaneTakeoff,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { submitVisaRequest } from "../utils/visaStore";
import toast from "react-hot-toast";
import StayServicesForm from "../components/StayServicesForm";
import OutgoingServicesForm from "../components/OutgoingServicesForm";

// ═══════════════════════════════════════════════════════════════
// SERVICE TYPE OPTIONS
// ═══════════════════════════════════════════════════════════════

const SERVICE_TYPES = [
  {
    value: "incoming",
    label: "Coming to Nepal",
    Icon: PlaneLanding,
    desc: "Visa assistance for foreigners entering Nepal",
    gradient: "from-sky-500 to-blue-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    iconColor: "text-sky-600",
  },
  {
    value: "stay",
    label: "Already in Nepal",
    Icon: MapPinned,
    desc: "Visa extension, travel support, SIM, translation",
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    iconColor: "text-emerald-600",
  },
  {
    value: "outgoing",
    label: "Leaving Nepal",
    Icon: PlaneTakeoff,
    desc: "Exit visa, overstay help, airport drop, flights",
    gradient: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconColor: "text-amber-600",
  },
];

// ═══════════════════════════════════════════════════════════════
// ORIGINAL INCOMING FORM CONSTANTS (untouched)
// ═══════════════════════════════════════════════════════════════

const VISA_TYPES = [
  {
    value: "tourist",
    label: "Tourist",
    Icon: Plane,
    desc: "Sightseeing, trekking, leisure",
  },
  {
    value: "business",
    label: "Business",
    Icon: Briefcase,
    desc: "Investment, meetings, trade",
  },
  {
    value: "study",
    label: "Study",
    Icon: BookOpen,
    desc: "Academic courses, research",
  },
  { value: "work", label: "Work", Icon: Users, desc: "Employment in Nepal" },
];

const DURATION_OPTIONS = [
  { value: "15 days", label: "15 days", fee: "$30 USD" },
  { value: "30 days", label: "30 days", fee: "$50 USD" },
  { value: "90 days", label: "90 days", fee: "$125 USD" },
];

const ENTRY_OPTIONS = [
  {
    value: "air",
    label: "By air",
    desc: "Tribhuvan International Airport, Kathmandu",
  },
  {
    value: "land",
    label: "By land",
    desc: "Kakarbhitta, Birgunj, Belahiya, Rasuwagadhi",
  },
];

const DOCUMENTS = [
  {
    value: "passport",
    label: "Valid passport (6+ months validity, 2 blank pages)",
  },
  { value: "photos", label: "Passport-sized photos (white background)" },
  { value: "flight_ticket", label: "Return / onward flight ticket" },
  { value: "hotel_booking", label: "Hotel or accommodation booking" },
  { value: "travel_insurance", label: "Travel insurance" },
  { value: "bank_statement", label: "Bank statement / proof of funds" },
  {
    value: "invitation_letter",
    label: "Invitation / recommendation letter (business/study/work)",
  },
];

const createInitialForm = () => ({
  visaType: "",
  arrivalDate: "",
  duration: "",
  entryMethod: "",
  dateOfBirth: "",
  passportExpiry: "",
  purpose: "",
  visitedBefore: null,
  previousRejection: null,
  documentsReady: [],
  phone: "",
  message: "",
});

const TOTAL_STEPS = 4;

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function VisaServicesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── Service type selector ──
  const [serviceType, setServiceType] = useState(null);

  // ── Incoming form state (original, untouched) ──
  const [step, setStep] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(createInitialForm);

  const update = (field, value) =>
    setForm((cur) => ({ ...cur, [field]: value }));

  const toggleDoc = (value) =>
    setForm((cur) => ({
      ...cur,
      documentsReady: cur.documentsReady.includes(value)
        ? cur.documentsReady.filter((d) => d !== value)
        : [...cur.documentsReady, value],
    }));

  const isStepComplete = (s) => {
    if (s === 1)
      return (
        form.visaType && form.arrivalDate && form.duration && form.entryMethod
      );
    if (s === 2) return form.dateOfBirth && form.passportExpiry;
    if (s === 3)
      return (
        form.purpose &&
        form.visitedBefore !== null &&
        form.previousRejection !== null
      );
    if (s === 4) return form.phone;
    return false;
  };

  const goNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      toast.success("Step completed");
      return;
    }
    setShowSummary(true);
    toast.success("Step completed");
  };

  const goBack = () => {
    if (showSummary) {
      setShowSummary(false);
      setStep(TOTAL_STEPS);
      return;
    }
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitVisaRequest(form, user);
      toast.success("Visa assistance request submitted!");
      navigate("/my-visa-requests");
    } catch (err) {
      toast.error(err.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Reset back to service type selection ──
  const goBackToSelector = () => {
    setServiceType(null);
    setStep(1);
    setShowSummary(false);
    setForm(createInitialForm());
  };

  const stepLabel = showSummary ? "Review" : `Step ${step}/${TOTAL_STEPS}`;
  const stepTitle = showSummary
    ? "Review your request"
    : [
        "Travel details",
        "Passport validity",
        "Background info",
        "Documents & contact",
      ][step - 1];

  // ═══════════════════════════════════════════════════════════════
  // RENDER — SERVICE TYPE SELECTOR (Step 0)
  // ═══════════════════════════════════════════════════════════════

  if (serviceType === null) {
    return (
      <div className="fade-in shell py-12 md:py-16">
        <section className="glass-panel mb-8 p-6 md:p-7">
          <div className="section-label mb-2">Visa Services</div>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="page-title">Visa & Travel Assistance</h1>
              <p className="mt-1.5 text-slate-500">
                Choose the service that matches your situation. We'll guide you
                through the rest.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <Globe size={16} className="text-crimson-500" />
              <span className="font-semibold">Full-service visa support</span>
            </div>
          </div>
        </section>

        <div className="mb-4">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-crimson-600 mb-1">
            Select service type
          </div>
          <h2 className="text-2xl font-display font-bold text-nepal-dark">
            What do you need help with?
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {SERVICE_TYPES.map(
            ({ value, label, Icon, desc, gradient, bg, border, iconColor }) => (
              <button
                key={value}
                onClick={() => setServiceType(value)}
                className={`group cursor-pointer rounded-3xl border ${border} ${bg} p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
              >
                <div
                  className={`mb-4 inline-flex items-center justify-center rounded-2xl bg-white/80 p-3 ${border}`}
                >
                  <Icon size={24} className={iconColor} />
                </div>
                <h3 className="text-lg font-display font-bold text-nepal-dark">
                  {label}
                </h3>
                <p className="mt-1.5 text-sm text-slate-500">{desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-crimson-600 opacity-0 transition group-hover:opacity-100">
                  Get started →
                </div>
              </button>
            ),
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER — STAY SERVICES FORM
  // ═══════════════════════════════════════════════════════════════

  if (serviceType === "stay") {
    return <StayServicesForm onBack={goBackToSelector} />;
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER — OUTGOING SERVICES FORM
  // ═══════════════════════════════════════════════════════════════

  if (serviceType === "outgoing") {
    return <OutgoingServicesForm onBack={goBackToSelector} />;
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER — INCOMING VISA FORM (original, untouched)
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="fade-in shell py-12 md:py-16">
      {/* ── Header ── */}
      <section className="glass-panel mb-8 p-6 md:p-7">
        <div className="section-label mb-2">Visa Services</div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="page-title">Nepal Visa Assistance</h1>
            <p className="mt-1.5 text-slate-500">
              We help foreigners navigate Nepal's visa process — from document
              checklist to application guidance.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            <Globe size={16} className="text-crimson-500" />
            <span className="font-semibold">
              Tourist visa from $30 · 15 / 30 / 90 days
            </span>
          </div>
        </div>
      </section>

      {/* ── Back to service selector ── */}
      <button
        onClick={goBackToSelector}
        className="mb-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
      >
        ← All services
      </button>

      {/* ── Form card ── */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-5 shadow-sm md:p-7">
        {/* Step header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-crimson-600">
              {stepLabel}
            </div>
            <h2 className="mt-1 text-2xl font-display font-bold text-nepal-dark">
              {stepTitle}
            </h2>
            {!showSummary && (
              <div className="mt-3 flex items-center gap-1.5">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-8 rounded-full ${i + 1 <= step ? "bg-crimson-500" : "bg-slate-200"}`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-crimson-100 bg-gradient-to-br from-crimson-50 via-orange-50 to-amber-50 px-4 py-3 text-right shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Account
            </div>
            <div className="mt-1 text-sm font-semibold text-nepal-dark">
              {user?.full_name || "Learner"}
            </div>
            <div className="text-xs text-slate-400">{user?.country}</div>
          </div>
        </div>

        {/* ── Step 1: Travel details ── */}
        {!showSummary && step === 1 && (
          <div className="space-y-6">
            <div>
              <div className="mb-3 text-sm font-semibold text-nepal-dark">
                Visa type needed
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {VISA_TYPES.map(({ value, label, Icon, desc }) => (
                  <label
                    key={value}
                    className={`cursor-pointer rounded-2xl border px-4 py-4 transition ${
                      form.visaType === value
                        ? "border-crimson-300 bg-crimson-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="visaType"
                      value={value}
                      checked={form.visaType === value}
                      onChange={() => update("visaType", value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2 mb-1">
                      <Icon
                        size={16}
                        className={
                          form.visaType === value
                            ? "text-crimson-600"
                            : "text-slate-500"
                        }
                      />
                      <span className="text-sm font-semibold text-nepal-dark">
                        {label}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">{desc}</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">
                  Intended arrival date
                </label>
                <input
                  type="date"
                  value={form.arrivalDate}
                  onChange={(e) => update("arrivalDate", e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">
                  Duration of stay
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DURATION_OPTIONS.map(({ value, label, fee }) => (
                    <label
                      key={value}
                      className={`cursor-pointer rounded-2xl border px-3 py-3 text-center text-sm transition ${
                        form.duration === value
                          ? "border-crimson-300 bg-crimson-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="duration"
                        value={value}
                        checked={form.duration === value}
                        onChange={() => update("duration", value)}
                        className="sr-only"
                      />
                      <div className="font-semibold text-nepal-dark">
                        {label}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">{fee}</div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-3 text-sm font-semibold text-nepal-dark">
                Entry method
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {ENTRY_OPTIONS.map(({ value, label, desc }) => (
                  <label
                    key={value}
                    className={`cursor-pointer rounded-2xl border px-4 py-3 transition ${
                      form.entryMethod === value
                        ? "border-crimson-300 bg-crimson-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="entryMethod"
                      value={value}
                      checked={form.entryMethod === value}
                      onChange={() => update("entryMethod", value)}
                      className="sr-only"
                    />
                    <div className="text-sm font-semibold text-nepal-dark">
                      {label}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">{desc}</div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Passport validity ── */}
        {!showSummary && step === 2 && (
          <div className="mx-auto max-w-lg space-y-5">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Your passport must be valid for at least 6 months beyond your
              arrival date and have at least 2 blank pages.
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">
                Date of birth
              </label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => update("dateOfBirth", e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">
                Passport expiry date
              </label>
              <input
                type="date"
                value={form.passportExpiry}
                onChange={(e) => update("passportExpiry", e.target.value)}
                className="input-field"
              />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
              We already have your passport number from your account (
              {user?.passport_number || "—"}). No need to enter it again.
            </div>
          </div>
        )}

        {/* ── Step 3: Background ── */}
        {!showSummary && step === 3 && (
          <div className="mx-auto max-w-lg space-y-6">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">
                Purpose of visit
              </label>
              <textarea
                value={form.purpose}
                onChange={(e) => update("purpose", e.target.value)}
                placeholder="e.g. Trekking to Everest Base Camp and exploring Kathmandu"
                rows={3}
                className="input-field resize-none"
              />
            </div>

            <div>
              <div className="mb-3 text-sm font-semibold text-nepal-dark">
                Have you visited Nepal before?
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ].map(({ value, label }) => (
                  <label
                    key={String(value)}
                    className={`cursor-pointer rounded-2xl border px-4 py-3 text-center text-sm font-semibold transition ${
                      form.visitedBefore === value
                        ? "border-crimson-300 bg-crimson-50 text-nepal-dark shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="visitedBefore"
                      checked={form.visitedBefore === value}
                      onChange={() => update("visitedBefore", value)}
                      className="sr-only"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 text-sm font-semibold text-nepal-dark">
                Any previous visa rejections?
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ].map(({ value, label }) => (
                  <label
                    key={String(value)}
                    className={`cursor-pointer rounded-2xl border px-4 py-3 text-center text-sm font-semibold transition ${
                      form.previousRejection === value
                        ? "border-crimson-300 bg-crimson-50 text-nepal-dark shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="previousRejection"
                      checked={form.previousRejection === value}
                      onChange={() => update("previousRejection", value)}
                      className="sr-only"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Documents & contact ── */}
        {!showSummary && step === 4 && (
          <div className="space-y-6">
            <div>
              <div className="mb-3 text-sm font-semibold text-nepal-dark">
                Documents you already have
                <span className="ml-2 font-normal text-slate-400">
                  (tick all that apply)
                </span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {DOCUMENTS.map(({ value, label }) => (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                      form.documentsReady.includes(value)
                        ? "border-crimson-300 bg-crimson-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.documentsReady.includes(value)}
                      onChange={() => toggleDoc(value)}
                      className="mt-0.5"
                    />
                    <span
                      className={
                        form.documentsReady.includes(value)
                          ? "text-nepal-dark"
                          : "text-slate-600"
                      }
                    >
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">
                  Phone number{" "}
                  <span className="font-normal text-slate-400">
                    (with country code)
                  </span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+1-202-555-0191"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">
                  Additional message{" "}
                  <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Any specific questions or concerns"
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Summary ── */}
        {showSummary && (
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Visa type", value: form.visaType },
              { label: "Arrival date", value: form.arrivalDate },
              { label: "Duration", value: form.duration },
              { label: "Entry method", value: form.entryMethod },
              { label: "Date of birth", value: form.dateOfBirth },
              { label: "Passport expiry", value: form.passportExpiry },
              { label: "Purpose", value: form.purpose },
              {
                label: "Visited before",
                value: form.visitedBefore ? "Yes" : "No",
              },
              {
                label: "Prior rejection",
                value: form.previousRejection ? "Yes" : "No",
              },
              { label: "Phone", value: form.phone },
              {
                label: "Documents ready",
                value: form.documentsReady.length
                  ? form.documentsReady.join(", ")
                  : "None selected",
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {label}
                </div>
                <div className="mt-1 text-sm font-semibold text-nepal-dark capitalize">
                  {value || "—"}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <button
            onClick={step === 1 && !showSummary ? goBackToSelector : goBack}
            className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-nepal-dark transition hover:bg-slate-100"
          >
            {step === 1 && !showSummary ? "← All services" : "Back"}
          </button>

          {showSummary ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="cursor-pointer rounded-xl bg-gradient-to-r from-crimson-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-crimson-700 hover:to-orange-600 disabled:opacity-60"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting…
                </span>
              ) : (
                "Submit Request"
              )}
            </button>
          ) : (
            isStepComplete(step) && (
              <button onClick={goNext} className="btn-primary cursor-pointer">
                {step === TOTAL_STEPS ? "Review & Submit" : "Continue"}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
