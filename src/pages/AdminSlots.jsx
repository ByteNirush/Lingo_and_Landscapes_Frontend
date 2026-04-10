import { useEffect, useState } from "react";
import { Inbox, Plus, Trash2, X, Link2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import SlotCard from "../components/SlotCard";
import {
  createDemoSlot,
  deleteAdminSlot,
  getAdminSlots,
  getApprovedDemoRequests,
} from "../utils/demoWorkflowStore";

const emptyForm = {
  requestId: "",
  date: "",
  time: "",
  meetLink: "",
  description: "",
};

const RequestPill = ({ request, onUse }) => (
  <button
    type="button"
    onClick={() => onUse(request)}
    className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-crimson-200 hover:shadow-md"
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-sm font-semibold text-nepal-dark">
          {request.user?.name || "Learner"}
        </div>
        <div className="mt-1 text-xs text-slate-500">
          {request.goal} · {request.duration}
        </div>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-semibold text-sky-800">
        <CheckCircle2 size={12} aria-hidden="true" />
        Approved
      </span>
    </div>
  </button>
);

export default function AdminSlots() {
  const [slots, setSlots] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchData = () => {
    setSlots(getAdminSlots());
    setApprovedRequests(getApprovedDemoRequests());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const handleWorkflowUpdate = () => fetchData();
    window.addEventListener("demo-workflow-updated", handleWorkflowUpdate);
    return () =>
      window.removeEventListener("demo-workflow-updated", handleWorkflowUpdate);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUseRequest = (request) => {
    setForm((current) => ({
      ...current,
      requestId: request.id,
      date: request.preferredDate || current.date,
      description: request.goal
        ? `Demo session for ${request.user?.name || "Learner"} · ${request.goal}`
        : current.description,
    }));
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      createDemoSlot({
        requestId: form.requestId || null,
        date: form.date,
        time: form.time,
        meetLink: form.meetLink,
        description: form.description,
      });
      toast.success("Slot created and sent to learner");
      setForm(emptyForm);
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error("Failed to create slot");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slot?")) return;
    try {
      deleteAdminSlot(id);
      toast.success("Slot deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete slot");
    }
  };

  return (
    <div className="fade-in shell py-12 md:py-16">
      <div className="glass-panel mb-8 flex flex-wrap items-end justify-between gap-4 p-6 md:p-7">
        <div>
          <div className="section-label mb-2">Admin · Demo Slots</div>
          <h1 className="page-title">Create and Send Slots</h1>
          <p className="mt-1.5 text-slate-500">
            {slots.length} sent slot{slots.length !== 1 ? "s" : ""} ·{" "}
            {approvedRequests.length} approved request
            {approvedRequests.length !== 1 ? "s" : ""} ready
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary cursor-pointer inline-flex items-center gap-2"
        >
          {showForm ? (
            <>
              <X size={16} aria-hidden="true" />
              Cancel
            </>
          ) : (
            <>
              <Plus size={16} aria-hidden="true" />
              New Slot
            </>
          )}
        </button>
      </div>

      {approvedRequests.length > 0 && (
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Link2 size={18} className="text-sky-600" aria-hidden="true" />
            <h2 className="text-lg font-display font-bold text-nepal-dark">
              Approved requests ready for slot creation
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {approvedRequests.map((request) => (
              <RequestPill
                key={request.id}
                request={request}
                onUse={handleUseRequest}
              />
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="card mb-8 border-crimson-200 shadow-sm">
          <div className="section-label mb-4">Create Demo Slot</div>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">
                Link to approved request
              </label>
              <select
                name="requestId"
                value={form.requestId}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Manual slot creation</option>
                {approvedRequests.map((request) => (
                  <option key={request.id} value={request.id}>
                    {request.user?.name || "Learner"} · {request.goal}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-nepal-dark mb-1.5">
                Google Meet Link
              </label>
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
              <label className="mb-1.5 block text-sm font-semibold text-nepal-dark">
                Description{" "}
                <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. 45 min demo class with tutor"
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating…
                  </span>
                ) : (
                  "Create Slot"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse h-40" />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <div className="card-soft py-20 text-center">
          <div className="mb-3 flex justify-center text-slate-400">
            <Inbox size={34} aria-hidden="true" />
          </div>
          <p className="text-slate-500">
            No slots yet. Create your first one above.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <div key={slot.id} className="relative group">
              <SlotCard slot={slot} />
              <button
                onClick={() => handleDelete(slot.id)}
                className="absolute top-3 right-3 inline-flex cursor-pointer items-center gap-1.5 opacity-0 transition-opacity bg-white border border-black/10 text-red-500 hover:bg-red-50 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm group-hover:opacity-100"
              >
                <Trash2 size={14} aria-hidden="true" />
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
