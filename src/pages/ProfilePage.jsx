import { useAuth } from "../context/AuthContext";
import { Globe, IdCard, Mail, User } from "lucide-react";
import { formatLongDate } from "../utils/date";

const ProfileField = ({ label, value, icon }) => (
  <div className="flex items-start gap-4 rounded-xl border border-slate-200/60 bg-white/60 p-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-crimson-100 text-lg">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-semibold text-nepal-dark">
        {value || "—"}
      </div>
    </div>
  </div>
);

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="fade-in shell py-12 md:py-16">
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200/80 p-6 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.65)] md:p-8">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to bottom right, rgba(2, 6, 23, 0.96), rgba(15, 23, 42, 0.94) 55%, rgba(127, 29, 29, 0.88)), radial-gradient(circle at top right, rgba(248, 113, 113, 0.2), transparent 35%), radial-gradient(circle at bottom left, rgba(56, 189, 248, 0.18), transparent 30%)",
          }}
        />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
            My Profile
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl">
            {user?.full_name || "Learner"}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
            View and manage your personal information and account details.
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.5fr]">
        <div className="card-soft">
          <div className="section-label mb-3">Personal Information</div>
          <h2 className="text-2xl font-display font-bold text-nepal-dark">
            Account Details
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <ProfileField
              label="Full Name"
              value={user?.full_name}
              icon={<User size={18} aria-hidden="true" />}
            />
            <ProfileField
              label="Email Address"
              value={user?.email}
              icon={<Mail size={18} aria-hidden="true" />}
            />
            <ProfileField
              label="Country"
              value={user?.country}
              icon={<Globe size={18} aria-hidden="true" />}
            />
            <ProfileField
              label="Passport Number"
              value={user?.passport_number}
              icon={<IdCard size={18} aria-hidden="true" />}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-soft">
            <div className="section-label mb-3">Account Status</div>
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <span>Role</span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    user?.role === "admin"
                      ? "bg-purple-50 text-purple-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {user?.role === "admin" ? "Administrator" : "Learner"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <span>Member Since</span>
                <span className="font-semibold text-nepal-dark">
                  {user?.created_at ? formatLongDate(user.created_at) : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Last Updated</span>
                <span className="font-semibold text-nepal-dark">
                  {user?.updated_at ? formatLongDate(user.updated_at) : "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="section-label mb-3">Quick Stats</div>
            <h3 className="text-2xl font-display font-bold text-nepal-dark">
              Your Journey
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Your profile is complete and ready for booking sessions. Keep your
              details up to date for a seamless experience.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
