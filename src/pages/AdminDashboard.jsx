import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const StatCard = ({ icon, label, value, to, color }) => (
  <Link to={to} className="card block group hover:-translate-y-1 hover:shadow-lg">
    <div className="flex items-start justify-between">
      <div>
        <div className="section-label mb-2">{label}</div>
        <div className="text-4xl font-display font-bold text-nepal-dark">{value ?? '—'}</div>
      </div>
      <div className={`rounded-xl p-3 text-3xl ${color}`}>{icon}</div>
    </div>
    <div className="mt-4 text-xs font-semibold text-crimson-500 group-hover:underline">View details →</div>
  </Link>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: null, slots: null, bookings: null });

  useEffect(() => {
    const load = async () => {
      try {
        const [u, s, b] = await Promise.all([
          api.get('/users'),
          api.get('/slots'),
          api.get('/bookings'),
        ]);
        setStats({
          users: u.data.users.length,
          slots: s.data.slots.length,
          bookings: b.data.bookings.length,
          available: s.data.slots.filter((sl) => !sl.isBooked).length,
        });
      } catch {
        toast.error('Failed to load dashboard stats');
      }
    };
    load();
  }, []);

  return (
    <div className="fade-in shell py-10">
      <div className="glass-panel mb-10 p-6 md:p-7">
        <div className="section-label mb-2">Admin Panel</div>
        <h1 className="page-title">Dashboard</h1>
        <p className="mt-1.5 text-slate-500">Overview of your platform activity</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        <StatCard icon="👥" label="Total Users" value={stats.users} to="/admin/users" color="bg-blue-50" />
        <StatCard icon="📅" label="Total Slots" value={stats.slots} to="/admin/slots" color="bg-amber-50" />
        <StatCard icon="✅" label="Bookings Made" value={stats.bookings} to="/admin/bookings" color="bg-emerald-50" />
        <StatCard icon="🟢" label="Available Slots" value={stats.available} to="/admin/slots" color="bg-crimson-50" />
      </div>

      <div className="card-soft border-slate-300 mb-6">
        <div className="section-label mb-4">Quick Actions</div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/slots" className="btn-primary">+ Create New Slot</Link>
          <Link to="/admin/bookings" className="btn-secondary">View All Bookings</Link>
          <Link to="/admin/users" className="btn-ghost border border-black/10">Manage Users</Link>
        </div>
      </div>
    </div>
  );
}
