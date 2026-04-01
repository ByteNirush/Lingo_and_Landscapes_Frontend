import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import SlotCard from '../components/SlotCard';

const emptyForm = { date: '', time: '', meetLink: '', description: '' };

export default function AdminSlots() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchSlots = async () => {
    try {
      const { data } = await api.get('/slots');
      setSlots(data.slots);
    } catch {
      toast.error('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlots(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/slots', form);
      toast.success('Slot created successfully!');
      setForm(emptyForm);
      setShowForm(false);
      fetchSlots();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create slot');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this slot?')) return;
    try {
      await api.delete(`/slots/${id}`);
      toast.success('Slot deleted');
      fetchSlots();
    } catch {
      toast.error('Failed to delete slot');
    }
  };

  return (
    <div className="fade-in shell py-10">
      <div className="glass-panel mb-8 flex flex-wrap items-end justify-between gap-4 p-6 md:p-7">
        <div>
          <div className="section-label mb-2">Admin · Slots</div>
          <h1 className="page-title">Manage Slots</h1>
          <p className="mt-1.5 text-slate-500">{slots.length} total · {slots.filter(s => !s.isBooked).length} available</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '✕ Cancel' : '+ New Slot'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-8 border-crimson-200 shadow-md">
          <div className="section-label mb-4">Create New Slot</div>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-nepal-dark mb-1.5">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-nepal-dark mb-1.5">Time</label>
              <input type="time" name="time" value={form.time} onChange={handleChange} required className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-nepal-dark mb-1.5">Google Meet Link</label>
              <input
                type="url"
                name="meetLink"
                value={form.meetLink}
                onChange={handleChange}
                placeholder="https://meet.google.com/xxx-xxx-xxx"
                required
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">Description <span className="font-normal text-slate-400">(optional)</span></label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. Beginner level · 60 min"
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating…
                  </span>
                ) : 'Create Slot'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => <div key={i} className="card animate-pulse h-40" />)}
        </div>
      ) : slots.length === 0 ? (
        <div className="card-soft py-20 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-slate-500">No slots yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {slots.map((slot) => (
            <div key={slot._id} className="relative group">
              <SlotCard slot={slot} />
              {!slot.isBooked && (
                <button
                  onClick={() => handleDelete(slot._id)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-black/10 text-red-500 hover:bg-red-50 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
