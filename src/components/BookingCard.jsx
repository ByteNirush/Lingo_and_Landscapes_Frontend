import { formatLongDate, formatShortDateTime } from '../utils/date';

export default function BookingCard({ booking, showUser = false }) {
  const slot = booking.slot;
  const user = booking.user;
  const bookedAt = formatShortDateTime(booking.createdAt);

  if (!slot) return null;

  return (
    <div className="card group hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="section-label mb-2">Confirmed Session</div>

          {showUser && user && (
            <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-crimson-500 text-sm font-bold text-white">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-nepal-dark">{user.name}</div>
                <div className="text-xs text-slate-400">{user.email}</div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-semibold text-nepal-dark">{formatLongDate(slot.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-slate-600">{slot.time}</span>
            </div>
          </div>
        </div>

        <span className="badge-booked flex-shrink-0">Booked</span>
      </div>

      {slot.meetLink && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-400">Join your session</span>
            <a
              href={slot.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-crimson-50 px-3 py-1.5 text-sm font-semibold text-crimson-600 transition hover:bg-crimson-100"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.869v6.262a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Join Google Meet
            </a>
          </div>
        </div>
      )}

      <div className="mt-2 text-xs text-slate-400">Booked on {bookedAt}</div>
    </div>
  );
}
