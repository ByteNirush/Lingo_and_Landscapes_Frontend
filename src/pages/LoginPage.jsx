import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/slots');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in shell flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mb-4 flex justify-center">
            <img src={logo} alt="Lingo Landscape Logo" className="h-12 w-auto" />
          </div>
          <h1 className="mb-2 text-3xl font-display font-bold text-nepal-dark">Welcome back</h1>
          <p className="text-slate-500">Sign in to continue your Nepali journey</p>
        </div>

        <div className="glass-panel border-slate-200 p-6 shadow-lg md:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">Email address</label>
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
              <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Your password"
                required
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2 w-full py-3 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-crimson-500 font-semibold hover:underline">Create one free</Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Admin? Use your admin credentials to access the dashboard.
        </p>
      </div>
    </div>
  );
}
