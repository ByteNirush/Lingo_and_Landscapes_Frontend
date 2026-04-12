// src/components/MultiStepBookingForm.jsx
// Only change from original: submitForApproval is now async (submitDemoRequest returns a Promise)

import { useState } from "react";
import {
  CloudSun,
  Moon,
  Sun,
  Sunrise,
  MessageCircle,
  Plane,
  Briefcase,
  BookOpen,
  Globe,
} from "lucide-react";
import { formatLongDate } from "../utils/date";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { submitDemoRequest } from "../utils/demoWorkflowStore";
import { useNavigate } from "react-router-dom";

const TOTAL_STEPS = 5;
const LEVEL_OPTIONS = ["Beginner", "Elementary", "Intermediate", "Advanced"];
const EXPERIENCE_OPTIONS = [
  "No previous experience",
  "Self-study only",
  "Took classes before",
  "Lived or studied in Nepal",
];
const FOCUS_OPTIONS = [
  "Speaking confidence",
  "Listening comprehension",
  "Reading fluency",
  "Writing accuracy",
  "Pronunciation",
  "Grammar and vocabulary",
];
const GOAL_OPTIONS = [
  {
    label: "Conversation",
    Icon: MessageCircle,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    label: "Travel",
    Icon: Plane,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    label: "Work",
    Icon: Briefcase,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    label: "Exam",
    Icon: BookOpen,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    label: "Cultural",
    Icon: Globe,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
];
const DURATION_OPTIONS = ["30 min", "45 min", "60 min"];
const AVAILABILITY_WINDOWS = [
  {
    key: "early-morning",
    label: "Early Morning",
    range: "4am - 8am",
    Icon: Sunrise,
  },
  { key: "morning", label: "Morning", range: "9am - 11am", Icon: CloudSun },
  { key: "afternoon", label: "Afternoon", range: "12pm - 6pm", Icon: Sun },
  { key: "evening", label: "Evening", range: "7pm - 3am", Icon: Moon },
];
const DAYS_OPTIONS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const createInitialForm = (selectedDate) => ({
  level: "",
  experience: "",
  focus: [],
  goal: "",
  preferredDate: selectedDate || "",
  availabilityWindows: [],
  availabilityDays: [],
  duration: "",
  budget: null,
});

const formatCurrency = (value) => `$${Number(value).toFixed(0)}`;
const MIN_BUDGET = 15;
const MAX_BUDGET = 120;
const DEFAULT_BUDGET = 40;

const getBudgetPercent = (value) => {
  const safeValue = Number(value ?? DEFAULT_BUDGET);
  const percent = ((safeValue - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100;
  return Math.max(0, Math.min(100, percent));
};

export default function MultiStepBookingForm({ selectedDate, onChangeDate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [budgetTouched, setBudgetTouched] = useState(false);
  const [formData, setFormData] = useState(() =>
    createInitialForm(selectedDate),
  );
  const preferredDateValue = selectedDate || formData.preferredDate || "";

  const updateField = (field, value) =>
    setFormData((cur) => ({ ...cur, [field]: value }));

  const toggleFocus = (focus) =>
    setFormData((cur) => ({
      ...cur,
      focus: cur.focus.includes(focus)
        ? cur.focus.filter((i) => i !== focus)
        : [...cur.focus, focus],
    }));

  const toggleListValue = (field, value) =>
    setFormData((cur) => ({
      ...cur,
      [field]: cur[field].includes(value)
        ? cur[field].filter((i) => i !== value)
        : [...cur[field], value],
    }));

  const isStepComplete = (step) => {
    if (step === 1) return formData.level && formData.focus.length > 0;
    if (step === 2) return Boolean(formData.goal);
    if (step === 3)
      return Boolean(
        preferredDateValue &&
        formData.availabilityWindows.length > 0 &&
        formData.availabilityDays.length > 0,
      );
    if (step === 4) return Boolean(formData.duration);
    if (step === 5)
      return (
        budgetTouched &&
        formData.budget !== null &&
        formData.budget !== undefined
      );
    return false;
  };

  const goNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
      toast.success("Step completed");
      return;
    }
    setShowSummary(true);
    toast.success("Step completed");
  };
  const goBack = () => {
    if (showSummary) {
      setShowSummary(false);
      setCurrentStep(TOTAL_STEPS);
      return;
    }
    setCurrentStep((s) => Math.max(1, s - 1));
  };
  const skipStep = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep((s) => s + 1);
    else setShowSummary(true);
    toast("Step skipped");
  };

  // ── ONLY CHANGE: now async, awaits the API call ───────────
  const submitForApproval = async () => {
    setSubmitting(true);
    try {
      await submitDemoRequest(
        {
          level: formData.level,
          experience: formData.experience,
          focus: formData.focus,
          goal: formData.goal,
          preferredDate: preferredDateValue,
          availabilityWindows: formData.availabilityWindows,
          availabilityDays: formData.availabilityDays,
          duration: formData.duration,
          budget: formData.budget ?? DEFAULT_BUDGET,
        },
        user,
      );
      setSubmitted(true);
      toast.success("Demo request submitted");
      navigate("/my-bookings");
    } catch {
      toast.error("Failed to submit request. Is JSON Server running?");
    } finally {
      setSubmitting(false);
    }
  };

  const budgetValue = formData.budget ?? DEFAULT_BUDGET;
  const rangeMinUsd = formatCurrency(Math.max(MIN_BUDGET, budgetValue - 30));
  const rangeMaxUsd = formatCurrency(Math.min(MAX_BUDGET, budgetValue + 30));
  const averageUsd = formatCurrency(budgetValue);
  const availabilityWindowLabels = formData.availabilityWindows
    .map((key) => AVAILABILITY_WINDOWS.find((w) => w.key === key)?.label || key)
    .join(", ");

  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm md:p-7">
        <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Request sent
        </div>
        <h2 className="text-2xl font-display font-bold text-nepal-dark">
          Your booking request is under review
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Thanks. A tutor will review your preferred date, time, and budget,
          then confirm your demo session.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setShowSummary(false);
            setCurrentStep(1);
            setBudgetTouched(false);
            setFormData(createInitialForm(selectedDate));
          }}
          className="mt-5 inline-flex cursor-pointer items-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Request another demo class
        </button>
      </div>
    );
  }

  const stepLabel = showSummary
    ? "Review"
    : `Step ${currentStep}/${TOTAL_STEPS}`;

  return (
    <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-white via-white to-slate-50 p-5 shadow-sm md:p-7">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-crimson-600">
            {stepLabel}
          </div>
          <h2 className="mt-1 text-2xl font-display font-bold text-nepal-dark">
            {showSummary
              ? "Review your booking request"
              : [
                  "Learning Background",
                  "Learning Goal / Purpose",
                  "Preferred Date & Time",
                  "Session Duration",
                  "Budget",
                ][currentStep - 1]}
          </h2>
          {showSummary && (
            <p className="mt-1 text-sm text-slate-500">
              Check every detail before sending your demo request to a tutor.
            </p>
          )}
          {!showSummary && (
            <div className="mt-3 flex items-center gap-1.5">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div
                  key={i + 1}
                  className={`h-1.5 w-8 rounded-full ${i + 1 <= currentStep ? "bg-crimson-500" : "bg-slate-200"}`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-crimson-100 bg-linear-to-br from-crimson-50 via-orange-50 to-amber-50 px-4 py-3 text-right shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Selected date
          </div>
          <div className="mt-1 text-sm font-semibold text-nepal-dark">
            {selectedDate
              ? formatLongDate(selectedDate)
              : "Choose a date above"}
          </div>
        </div>
      </div>

      {!showSummary && currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <div className="mb-3 text-sm font-semibold text-nepal-dark">
              Your level
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {LEVEL_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm font-semibold transition ${formData.level === option ? "border-crimson-300 bg-crimson-50 text-nepal-dark shadow-sm" : "border-slate-200 bg-white text-nepal-dark hover:border-slate-300 hover:bg-slate-50"}`}
                >
                  <input
                    type="radio"
                    name="level"
                    value={option}
                    checked={formData.level === option}
                    onChange={() => updateField("level", option)}
                    className="sr-only"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3 text-sm font-semibold text-nepal-dark">
              Previous experience
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {EXPERIENCE_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm transition ${formData.experience === option ? "border-crimson-300 bg-crimson-50 text-nepal-dark shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
                >
                  <input
                    type="radio"
                    name="experience"
                    value={option}
                    checked={formData.experience === option}
                    onChange={() => updateField("experience", option)}
                    className="sr-only"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3 text-sm font-semibold text-nepal-dark">
              Learning focus
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {FOCUS_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm transition ${formData.focus.includes(option) ? "border-crimson-400 bg-crimson-50 text-nepal-dark shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.focus.includes(option)}
                    onChange={() => toggleFocus(option)}
                    className="mr-2 align-middle"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {!showSummary && currentStep === 2 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GOAL_OPTIONS.map((goal) => {
            const IconComponent = goal.Icon;
            return (
              <label
                key={goal.label}
                className={`cursor-pointer rounded-2xl border px-4 py-4 transition ${formData.goal === goal.label ? "border-crimson-300 bg-crimson-50 text-nepal-dark shadow-sm" : "border-slate-200 bg-white text-nepal-dark hover:border-slate-300 hover:bg-slate-50"}`}
              >
                <input
                  type="radio"
                  name="goal"
                  value={goal.label}
                  checked={formData.goal === goal.label}
                  onChange={() => updateField("goal", goal.label)}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center rounded-lg p-2 ${formData.goal === goal.label ? "bg-crimson-100" : goal.bgColor}`}
                  >
                    <IconComponent
                      size={20}
                      className={
                        formData.goal === goal.label
                          ? "text-crimson-600"
                          : goal.color
                      }
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-sm font-semibold">{goal.label}</span>
                </div>
              </label>
            );
          })}
        </div>
      )}

      {!showSummary && currentStep === 3 && (
        <div className="space-y-6 md:px-4">
          <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-nepal-dark">
              Selected date
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Choose your availability for{" "}
              {preferredDateValue
                ? formatLongDate(preferredDateValue)
                : "the selected day"}
              .
            </p>
            <input
              type="date"
              value={preferredDateValue}
              onChange={(e) => {
                updateField("preferredDate", e.target.value);
                if (onChangeDate) onChangeDate(e.target.value);
              }}
              className="mt-3 w-full max-w-xs rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-crimson-400 focus:ring-2 focus:ring-crimson-100"
            />
          </div>
          <div className="mx-auto max-w-2xl">
            <div className="mb-3 text-sm font-semibold text-nepal-dark">
              Times
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {AVAILABILITY_WINDOWS.map((window) => (
                <label
                  key={window.key}
                  className={`cursor-pointer rounded-xl border px-4 py-3 text-center text-sm transition ${formData.availabilityWindows.includes(window.key) ? "border-crimson-300 bg-crimson-50 text-nepal-dark shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.availabilityWindows.includes(window.key)}
                    onChange={() =>
                      toggleListValue("availabilityWindows", window.key)
                    }
                    className="sr-only"
                  />
                  <window.Icon
                    size={18}
                    className={`mx-auto mb-1.5 ${formData.availabilityWindows.includes(window.key) ? "text-crimson-600" : "text-slate-500"}`}
                    aria-hidden="true"
                  />
                  <div className="font-semibold">{window.label}</div>
                  <div className="text-xs text-slate-500">{window.range}</div>
                </label>
              ))}
            </div>
            <div className="mt-5">
              <div className="mb-3 text-sm font-semibold text-nepal-dark">
                Days
              </div>
              <div className="grid grid-cols-7 overflow-hidden rounded-xl border border-slate-200 bg-white">
                {DAYS_OPTIONS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleListValue("availabilityDays", day)}
                    className={`cursor-pointer border-r border-slate-200 px-2 py-2 text-xs font-semibold transition last:border-r-0 ${formData.availabilityDays.includes(day) ? "bg-crimson-100 text-crimson-700" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!showSummary && currentStep === 4 && (
        <div className="grid gap-3 sm:grid-cols-3">
          {DURATION_OPTIONS.map((option) => (
            <label
              key={option}
              className={`cursor-pointer rounded-2xl border px-4 py-4 text-center text-sm font-semibold transition ${formData.duration === option ? "border-crimson-300 bg-crimson-50 text-nepal-dark shadow-sm" : "border-slate-200 bg-white text-nepal-dark hover:border-slate-300 hover:bg-slate-50"}`}
            >
              <input
                type="radio"
                name="duration"
                value={option}
                checked={formData.duration === option}
                onChange={() => updateField("duration", option)}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>
      )}

      {!showSummary && currentStep === 5 && (
        <div className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            What's your budget?
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-nepal-dark">
              {rangeMinUsd} - {rangeMaxUsd}
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Average: {averageUsd}
            </div>
          </div>
          <div className="mx-auto max-w-md px-3">
            <input
              type="range"
              min={MIN_BUDGET}
              max={MAX_BUDGET}
              step="5"
              value={budgetValue}
              onChange={(e) => {
                if (!budgetTouched) setBudgetTouched(true);
                updateField("budget", Number(e.target.value));
              }}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right, #f43f5e 0%, #f43f5e ${getBudgetPercent(budgetValue)}%, #d1d5db ${getBudgetPercent(budgetValue)}%, #d1d5db 100%)`,
              }}
            />
          </div>
          <div className="text-xs text-slate-400">
            Select a comfortable session range in USD.
          </div>
        </div>
      )}

      {showSummary && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <SummaryCard
              label="Level"
              value={formData.level || "Not provided"}
            />
            <SummaryCard
              label="Focus"
              value={
                formData.focus.length
                  ? formData.focus.join(", ")
                  : "Not provided"
              }
            />
            <SummaryCard label="Goal" value={formData.goal || "Not provided"} />
            <SummaryCard
              label="Preferred date & time"
              value={
                preferredDateValue
                  ? `${formatLongDate(preferredDateValue)} · ${availabilityWindowLabels || "No time"} · ${formData.availabilityDays.join(", ") || "No day"}`
                  : "Not provided"
              }
            />
            <SummaryCard
              label="Duration"
              value={formData.duration || "Not provided"}
            />
            <SummaryCard
              label="Budget"
              value={formatCurrency(formData.budget ?? DEFAULT_BUDGET)}
            />
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <button
          onClick={goBack}
          disabled={!showSummary && currentStep === 1}
          className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-nepal-dark transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>
        <div className="flex flex-wrap items-center gap-3">
          {!showSummary && (
            <button
              onClick={skipStep}
              className="cursor-pointer rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-slate-400 hover:text-nepal-dark"
            >
              Skip this step
            </button>
          )}
          {showSummary ? (
            <button
              onClick={submitForApproval}
              disabled={submitting}
              className="cursor-pointer rounded-xl bg-linear-to-r from-crimson-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-crimson-700 hover:to-orange-600 disabled:opacity-60"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting…
                </span>
              ) : (
                "Submit Demo Request"
              )}
            </button>
          ) : (
            isStepComplete(currentStep) && (
              <button
                onClick={goNext}
                className="cursor-pointer rounded-xl bg-crimson-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-crimson-700"
              >
                {currentStep === TOTAL_STEPS
                  ? "Continue to Review"
                  : "Continue"}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-nepal-dark">{value}</div>
    </div>
  );
}
