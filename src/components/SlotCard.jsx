import { formatLongDate } from "../utils/date";
import {
  generateGoogleCalendarUrl,
  downloadCalendarFile,
} from "../utils/calendar";

export default function SlotCard({ slot, onBook, booking = false }) {
  const handleAddToCalendar = () => {
    // Parse slot date and time to create start and end dates
    const slotDate = new Date(slot.date);
    const [hours, minutes] = slot.time.split(":").map(Number);

    const startDate = new Date(slotDate);
    startDate.setHours(hours, minutes, 0);

    // Assume 1 hour duration
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    // Generate calendar event
    const eventTitle = `Class Session - Lingo and Landscapes`;
    const eventDescription = `Booked class session${slot.description ? ": " + slot.description : ""}${slot.meetLink ? "\n\nGoogle Meet: " + slot.meetLink : ""}`;

    // Use Google Calendar URL for better UX
    const googleCalendarUrl = generateGoogleCalendarUrl({
      title: eventTitle,
      startDate,
      endDate,
      description: eventDescription,
      location: "Online - Google Meet",
    });

    // Open Google Calendar in new window
    window.open(googleCalendarUrl, "_blank");
  };
  return (
    <div
      className={`card relative overflow-hidden ${slot.isBooked ? "opacity-80" : "hover:-translate-y-1 hover:shadow-lg"}`}
    >
      <div
        className={`absolute left-0 right-0 top-0 h-1 ${slot.isBooked ? "bg-slate-300" : "bg-linear-to-r from-crimson-500 to-orange-400"}`}
      />

      <div className="mt-1 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="section-label mb-1.5">Class Session</div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-nepal-dark">
              {formatLongDate(slot.date)}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">{slot.time}</span>
          </div>
          {slot.description && (
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              {slot.description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {slot.isBooked ? (
            <span className="badge-booked">● Booked</span>
          ) : (
            <span className="badge-available">● Available</span>
          )}
        </div>
      </div>

      {slot.meetLink && !slot.isBooked && (
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-xs font-medium text-slate-400">
            Google Meet Session
          </span>
          {onBook && !slot.isBooked && (
            <button
              onClick={() => onBook(slot.id ?? slot._id)}
              disabled={booking}
              className="btn-primary px-5 py-2.5 text-sm"
            >
              {booking ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Booking…
                </span>
              ) : (
                "Book Now"
              )}
            </button>
          )}
        </div>
      )}

      {slot.isBooked && onBook && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-center text-xs text-slate-400">
            This slot has been taken
          </p>
        </div>
      )}

      {slot.isBooked && !onBook && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <button
            onClick={handleAddToCalendar}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-nepal-dark transition hover:bg-slate-100"
          >
            📅 Add to Google Calendar
          </button>
        </div>
      )}

      {onBook === false && (
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-xs text-slate-400">Admin view</span>
          <span
            className={`text-xs font-semibold ${slot.isBooked ? "text-red-500" : "text-emerald-600"}`}
          >
            {slot.isBooked ? "Booked" : "Open"}
          </span>
        </div>
      )}
    </div>
  );
}
