import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const EyeIcon = ({ visible }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-slate-400"
  >
    {visible ? (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
      </>
    )}
  </svg>
);

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fakeUser = {
        id: 1,
        full_name: "alex Sunar",
        email: form.email,
        role:
          form.email === "admin@test.com" && form.password === "1234"
            ? "admin"
            : "user",
      };
      const fakeToken = "fake-jwt-token";
      const isAdmin = fakeUser.role === "admin";
      login(fakeUser, fakeToken);
      toast.success(`Welcome back, ${fakeUser.full_name}!`);
      navigate(isAdmin ? "/admin" : "/dashboard");
    } catch {
      toast.error("Signin failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in shell flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mb-4 flex justify-center">
            <img
              src={logo}
              alt="Lingo Landscape Logo"
              className="h-16 w-auto md:h-20"
            />
          </div>
          <h1 className="mb-3 text-3xl md:text-4xl font-display font-bold text-nepal-dark tracking-tight">
            Welcome back
          </h1>
          <p className="text-slate-500 font-medium">
            Sign in to continue your Nepali journey
          </p>
        </div>

        <div className="glass-panel p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  required
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 w-full py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-crimson-500 font-semibold hover:underline"
            >
              Create one free
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Admin? Use your admin credentials to access the dashboard.
        </p>
      </div>
    </div>
  );
}
