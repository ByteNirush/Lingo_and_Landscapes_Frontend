import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import MultiStepBookingForm from "../components/MultiStepBookingForm";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const toDateKey = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function SlotsPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const monthYearLabel = currentMonth.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });
  const monthStart = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  );
  const monthEnd = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  );
  const leadingBlanks = monthStart.getDay();
  const daysInMonth = monthEnd.getDate();
  const monthCells = [
    ...Array.from({ length: leadingBlanks }, (_, i) => ({
      key: `blank-${i}`,
      isBlank: true,
    })),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        i + 1,
      );
      const key = toDateKey(date);
      return {
        key,
        day: i + 1,
        isToday: key === toDateKey(new Date()),
        isSelected: key === selectedDate,
      };
    }),
  ];

  return (
    <div className="fade-in shell py-12 md:py-16">
      <section className="glass-panel mb-8 p-6 md:p-7">
        <div className="section-label mb-2">Demo Requests</div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="page-title">Request a Demo Class</h1>
            <p className="mt-1.5 text-slate-500">
              Pick a date, complete the request form, and wait for the tutor to
              create your slot.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-nepal-dark">
              <CalendarDays size={16} aria-hidden="true" />
              Browse by date
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCurrentMonth(
                    (prev) =>
                      new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                  )
                }
                className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-nepal-dark"
                aria-label="Previous month"
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </button>
              <div className="min-w-40 text-center text-sm font-semibold text-nepal-dark">
                {monthYearLabel}
              </div>
              <button
                onClick={() =>
                  setCurrentMonth(
                    (prev) =>
                      new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                  )
                }
                className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-nepal-dark"
                aria-label="Next month"
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            {weekDays.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {monthCells.map((cell) => {
              if (cell.isBlank) {
                return <div key={cell.key} className="h-12 rounded-lg" />;
              }

              return (
                <button
                  key={cell.key}
                  onClick={() =>
                    setSelectedDate(cell.key === selectedDate ? null : cell.key)
                  }
                  className={`cursor-pointer relative h-12 rounded-lg border text-sm font-medium transition ${
                    cell.isSelected
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-crimson-200 bg-crimson-50 text-nepal-dark hover:bg-crimson-100"
                  } ${cell.isToday && !cell.isSelected ? "ring-1 ring-slate-300" : ""}`}
                  title={cell.isSelected ? "Selected date" : "Select date"}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <button
              onClick={() => {
                setSelectedDate(null);
                setCurrentMonth(
                  new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                );
              }}
              className="cursor-pointer rounded-md border border-slate-200 px-2.5 py-1 font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Reset date
            </button>
            {selectedDate ? (
              <span>Showing demo request for {selectedDate}</span>
            ) : (
              <span>Choose a date to start your demo request</span>
            )}
          </div>
        </div>
      </section>

      {selectedDate && (
        <section className="mb-8">
          <MultiStepBookingForm
            selectedDate={selectedDate}
            onChangeDate={(nextDate) => setSelectedDate(nextDate)}
          />
        </section>
      )}

      {!selectedDate && (
        <div className="card-soft py-16 text-center">
          <h2 className="mb-2 text-xl font-display font-bold text-nepal-dark">
            Request a demo class
          </h2>
          <p className="text-sm text-slate-500">
            Select your preferred date above, then complete the quick demo
            request form.
          </p>
        </div>
      )}
    </div>
  );
}
