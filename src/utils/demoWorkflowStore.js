// =============================================================
// src/utils/demoWorkflowStore.js  — JSON Server version
//

// Pages call these exactly as before — zero changes needed there.
// When the real backend is ready: change BASE_URL only.
// =============================================================

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ── tiny axios helper ─────────────────────────────────────────
const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const request = async ({ url, method = "GET", data }) => {
  const response = await client.request({ url, method, data });
  return response.data;
};

const nowIso = () => new Date().toISOString();

const createId = (prefix) => `${prefix}-${crypto.randomUUID()}`;

// ── normalise user shape (same helper as before) ──────────────
export const normalizeUser = (user) => {
  if (!user) return null;
  const email = user.email || "";
  const name = user.full_name || user.name || email.split("@")[0] || "Learner";
  return {
    id: user.id || user._id || email || createId("user"),
    name,
    full_name: user.full_name || user.name || name,
    email,
    role: user.role || "user",
    country: user.country || "",
    passport_number: user.passport_number || user.passportNumber || "",
    createdAt: user.createdAt || user.created_at || nowIso(),
  };
};

// sort newest-first (kept identical to localStorage version)
const sortNewestFirst = (items) =>
  [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

// ═══════════════════════════════════════════════════════════════
// AUTH — used by LoginPage / SignupPage
// ═══════════════════════════════════════════════════════════════

/**
 * signin({ email, password })
 * Returns { user, token } — same shape the real backend will return.
 */
export const signin = async ({ email, password }) => {
  const matches = await request({
    url: `/users?email=${encodeURIComponent(email)}`,
  });
  const found = matches.find((u) => u.password === password);
  if (!found) throw new Error("Invalid email or password");
  const { password: _, ...safeUser } = found;
  const token = `dev_${found.id}_${Date.now()}`;
  return { user: safeUser, token };
};

/**
 * signup({ full_name, email, password, country, passport_number })
 * Returns { user, token }
 */
export const signup = async ({
  full_name,
  email,
  password,
  country = "",
  passport_number = "",
}) => {
  const existing = await request({
    url: `/users?email=${encodeURIComponent(email)}`,
  });
  if (existing.length > 0) throw new Error("Email already registered");

  const newUser = {
    id: createId("user"),
    name: full_name,
    full_name,
    email,
    password, // plaintext OK for local dev only
    role: "user",
    country,
    passport_number,
    createdAt: nowIso(),
  };
  const created = await request({
    url: "/users",
    method: "POST",
    data: newUser,
  });
  const { password: _, ...safeUser } = created;
  const token = `dev_${safeUser.id}_${Date.now()}`;
  return { user: safeUser, token };
};

// ═══════════════════════════════════════════════════════════════
// DEMO REQUESTS
// ═══════════════════════════════════════════════════════════════

/**
 * submitDemoRequest(formPayload, currentUser)
 * Called by MultiStepBookingForm — same signature as before.
 */
export const submitDemoRequest = async (requestPayload, currentUser) => {
  const user = normalizeUser(currentUser);
  const newRequest = {
    id: createId("req"),
    userId: user?.id || createId("user"),
    user: user || {
      id: createId("user"),
      name: "Learner",
      email: "",
      role: "user",
      createdAt: nowIso(),
    },
    level: requestPayload.level || "",
    experience: requestPayload.experience || "",
    focus: requestPayload.focus || [],
    goal: requestPayload.goal || "",
    preferredDate: requestPayload.preferredDate || "",
    availabilityWindows: requestPayload.availabilityWindows || [],
    availabilityDays: requestPayload.availabilityDays || [],
    duration: requestPayload.duration || "",
    budget: requestPayload.budget ?? null,
    status: "pending",
    createdAt: nowIso(),
  };
  return request({
    url: "/requests",
    method: "POST",
    data: newRequest,
  });
};

/** Admin — returns all requests sorted newest first */
export const getAdminRequests = async () => {
  const data = await request({ url: "/requests?_sort=createdAt&_order=desc" });
  return sortNewestFirst(data);
};

/** Admin — approve a pending request */
export const reviewDemoRequest = async (requestId) => {
  return request({
    url: `/requests/${requestId}`,
    method: "PATCH",
    data: { status: "approved", reviewedAt: nowIso() },
  });
};

/** Returns only approved requests (for slot creation picker) */
export const getApprovedDemoRequests = async () => {
  const data = await request({
    url: "/requests?status=approved&_sort=createdAt&_order=desc",
  });
  return sortNewestFirst(data);
};

/** Learner — returns requests belonging to the current user */
export const getUserRequests = async (currentUser) => {
  const user = normalizeUser(currentUser);
  if (!user) return [];
  const data = await request({
    url: `/requests?userId=${user.id}&_sort=createdAt&_order=desc`,
  });
  return sortNewestFirst(data);
};

// ═══════════════════════════════════════════════════════════════
// SLOTS
// ═══════════════════════════════════════════════════════════════

/**
 * createDemoSlot({ requestId, date, time, meetLink, description })
 * Also creates a booking and marks the request as scheduled.
 * Called by AdminSlots — same signature as before.
 */
export const createDemoSlot = async ({
  requestId = null,
  date,
  time,
  meetLink,
  description,
}) => {
  // 1. Fetch the linked request (if any) to get user info
  let linkedRequest = null;
  if (requestId) {
    linkedRequest = await request({ url: `/requests/${requestId}` }).catch(
      () => null,
    );
  }
  const user = linkedRequest?.user || null;

  // 2. Create the slot
  const slot = {
    id: createId("slot"),
    requestId: requestId || null,
    userId: user?.id || null,
    user: user || null,
    date,
    time,
    description,
    meetLink,
    isBooked: true,
    createdAt: nowIso(),
  };
  const createdSlot = await request({
    url: "/slots",
    method: "POST",
    data: slot,
  });

  // 3. Create a booking if there's a linked user
  if (user) {
    const booking = {
      id: createId("booking"),
      requestId: requestId || null,
      userId: user.id,
      user,
      slot: {
        id: createdSlot.id,
        date: createdSlot.date,
        time: createdSlot.time,
        description: createdSlot.description,
        meetLink: createdSlot.meetLink,
      },
      createdAt: nowIso(),
    };
    await request({
      url: "/bookings",
      method: "POST",
      data: booking,
    });
  }

  // 4. Mark the request as scheduled
  if (linkedRequest) {
    await request({
      url: `/requests/${requestId}`,
      method: "PATCH",
      data: {
        status: "scheduled",
        scheduledSlotId: createdSlot.id,
        scheduledAt: nowIso(),
      },
    });
  }

  return createdSlot;
};

/** Admin — returns all slots */
export const getAdminSlots = async () => {
  const data = await request({ url: "/slots?_sort=createdAt&_order=desc" });
  return sortNewestFirst(data);
};

/** Admin — deletes a slot, its booking, and resets the linked request */
export const deleteAdminSlot = async (slotId) => {
  // Fetch the slot first to get requestId
  const slot = await request({ url: `/slots/${slotId}` }).catch(() => null);

  // Delete the slot
  await request({ url: `/slots/${slotId}`, method: "DELETE" });

  // Delete related booking(s)
  const bookings = await request({ url: `/bookings?slot.id=${slotId}` }).catch(
    () => [],
  );
  for (const booking of bookings) {
    await request({ url: `/bookings/${booking.id}`, method: "DELETE" });
  }

  // Reset the linked request back to "approved"
  if (slot?.requestId) {
    await request({
      url: `/requests/${slot.requestId}`,
      method: "PATCH",
      data: {
        status: "approved",
        scheduledSlotId: null,
        scheduledAt: null,
      },
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// BOOKINGS
// ═══════════════════════════════════════════════════════════════

/** Admin — returns all bookings */
export const getAdminBookings = async () => {
  const data = await request({ url: "/bookings?_sort=createdAt&_order=desc" });
  return sortNewestFirst(data);
};

/** Admin — cancel (delete) a booking and its slot */
export const cancelAdminBooking = async (bookingId) => {
  const booking = await request({ url: `/bookings/${bookingId}` }).catch(
    () => null,
  );
  await request({ url: `/bookings/${bookingId}`, method: "DELETE" });
  if (booking?.slot?.id) {
    await request({ url: `/slots/${booking.slot.id}`, method: "DELETE" }).catch(
      () => null,
    );
  }
};

/** Learner — returns bookings belonging to the current user */
export const getUserBookings = async (currentUser) => {
  const user = normalizeUser(currentUser);
  if (!user) return [];
  const data = await request({
    url: `/bookings?userId=${user.id}&_sort=createdAt&_order=desc`,
  });
  return sortNewestFirst(data);
};

// ═══════════════════════════════════════════════════════════════
// USERS (Admin)
// ═══════════════════════════════════════════════════════════════

/** Admin — returns all users */
export const getAdminUsers = async () => {
  const data = await request({ url: "/users?_sort=createdAt&_order=desc" });
  // Strip passwords before returning to UI
  return sortNewestFirst(data.map(({ password, ...u }) => u));
};

/** Admin — deletes a user */
export const deleteAdminUser = async (userId) => {
  return request({ url: `/users/${userId}`, method: "DELETE" });
};

// ═══════════════════════════════════════════════════════════════
// DASHBOARD STATS (Admin)
// ═══════════════════════════════════════════════════════════════

export const getAdminDashboardStats = async () => {
  const [users, requests, slots, bookings] = await Promise.all([
    request({ url: "/users" }),
    request({ url: "/requests" }),
    request({ url: "/slots" }),
    request({ url: "/bookings" }),
  ]);
  return {
    users: users.length,
    requests: requests.length,
    pendingRequests: requests.filter((r) => r.status === "pending").length,
    approvedRequests: requests.filter((r) => r.status === "approved").length,
    slots: slots.length,
    bookings: bookings.length,
  };
};

// ═══════════════════════════════════════════════════════════════
// getDemoState — kept for any legacy callers
// ═══════════════════════════════════════════════════════════════
export const getDemoState = async () => {
  const [users, requests, slots, bookings] = await Promise.all([
    request({ url: "/users" }),
    request({ url: "/requests" }),
    request({ url: "/slots" }),
    request({ url: "/bookings" }),
  ]);
  return { users, requests, slots, bookings };
};
