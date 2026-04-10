import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const publicNavItems = [
  { sectionId: "about", label: "About" },
  { sectionId: "how-it-works", label: "How It Works" },
  { sectionId: "testimonials", label: "Testimonials" },
  { sectionId: "faq", label: "FAQ" },
  { sectionId: "contact", label: "Contact" },
];

const learnerNavItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/slots", label: "Request Demo Class" },
  { to: "/my-bookings", label: "My Bookings" },
  { to: "/profile", label: "Profile" },
];

const adminNavItems = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/slots", label: "Slots" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/users", label: "Users" },
  { to: "/profile", label: "Profile" },
];

export default function Layout() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return;
    const sectionId = location.hash.replace("#", "");
    const timeoutId = setTimeout(() => scrollToSection(sectionId), 0);
    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.hash]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const isAdminArea = location.pathname.startsWith("/admin");
  const isLearnerArea = [
    "/dashboard",
    "/slots",
    "/my-bookings",
    "/profile",
  ].includes(location.pathname);
  const showDashboardNav = isAuthenticated && (isAdminArea || isLearnerArea);
  const showPublicNav = !showDashboardNav;

  const navLink = (to, label) => (
    <Link
      key={to}
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
        location.pathname === to
          ? "bg-crimson-50 text-crimson-600"
          : "text-slate-600 hover:bg-slate-100 hover:text-nepal-dark"
      }`}
    >
      {label}
    </Link>
  );

  const publicNavLink = (sectionId, label) => {
    const isActive =
      location.pathname === "/" && location.hash === `#${sectionId}`;

    return (
      <button
        key={sectionId}
        type="button"
        onClick={() => {
          setMenuOpen(false);
          navigate({ pathname: "/", hash: `#${sectionId}` });
          if (location.pathname === "/") {
            scrollToSection(sectionId);
          }
        }}
        className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
          isActive
            ? "bg-crimson-50 text-crimson-600"
            : "text-slate-600 hover:bg-slate-100 hover:text-nepal-dark"
        }`}
      >
        {label}
      </button>
    );
  };

  const roleNavItems = isAdmin ? adminNavItems : learnerNavItems;

  return (
    <div className="flex min-h-screen flex-col bg-nepal-white">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="shell flex h-20 items-center justify-between gap-3 md:h-24">
          <Link to="/" className="group flex items-center gap-2.5">
            <img
              src={logo}
              alt="Lingo Landscape Logo"
              className="h-8 w-auto transition group-hover:-translate-y-0.5"
            />
            <div>
              <div className="font-display text-lg font-bold leading-none text-nepal-dark">
                नमस्ते
              </div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase leading-none tracking-widest text-crimson-500">
                Learn Nepali
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {showPublicNav &&
              publicNavItems
                .slice(0, 2)
                .map((item) => publicNavLink(item.sectionId, item.label))}
            {showPublicNav && navLink("/gallery", "Gallery")}
            {showPublicNav &&
              publicNavItems
                .slice(2)
                .map((item) => publicNavLink(item.sectionId, item.label))}
            {showDashboardNav &&
              roleNavItems.map((item) => navLink(item.to, item.label))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <div className="flex items-center gap-4 px-1 py-2">
                <div className="text-right">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {isAdmin ? "Admin" : "Learner"}
                  </div>
                  <div className="text-sm font-bold text-nepal-dark">
                    {user?.full_name}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-secondary cursor-pointer !px-5 !py-2.5 !text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost !px-5 !py-2.5 !text-sm">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary !px-6 !py-2.5 !text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className="rounded-lg p-2 transition hover:bg-slate-100 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-6 bg-nepal-dark transition-transform duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-nepal-dark transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-nepal-dark transition-transform duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>

        {menuOpen && (
          <div
            id="mobile-menu"
            className="shell space-y-3 border-t border-slate-200 py-4 md:hidden"
          >
            {showPublicNav &&
              publicNavItems
                .slice(0, 2)
                .map((item) => publicNavLink(item.sectionId, item.label))}
            {showPublicNav && navLink("/gallery", "Gallery")}
            {showPublicNav &&
              publicNavItems
                .slice(2)
                .map((item) => publicNavLink(item.sectionId, item.label))}
            {showDashboardNav &&
              roleNavItems.map((item) => navLink(item.to, item.label))}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="btn-secondary mt-2 w-full cursor-pointer text-sm"
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn-ghost justify-center border border-slate-300 text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary justify-center text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200/80 bg-white/70 py-10 backdrop-blur-sm">
        <div className="shell flex flex-col items-center justify-between gap-4 text-center text-sm font-medium text-slate-500 md:flex-row md:text-left">
          <span>© {new Date().getFullYear()} Learn Nepali</span>
          <span>Made for fluent conversations and confident learners.</span>
        </div>
      </footer>
    </div>
  );
}
