const STORAGE_KEY = "demo-workflow-state";

const nowIso = () => new Date().toISOString();

const createId = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const normalizeUser = (user) => {
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

const seedState = () => {
  const admin = {
    id: "admin-1",
    name: "Admin User",
    full_name: "Admin User",
    email: "admin@test.com",
    role: "admin",
    country: "Nepal",
    passport_number: "-",
    createdAt: "2026-04-01T09:00:00.000Z",
  };

  const learner = {
    id: "user-1",
    name: "Gagan Sunar",
    full_name: "Gagan Sunar",
    email: "gagan@test.com",
    role: "user",
    country: "Nepal",
    passport_number: "A1234567",
    createdAt: "2026-04-02T09:00:00.000Z",
  };

  const request = {
    id: "req-1",
    userId: learner.id,
    user: learner,
    level: "Beginner",
    experience: "No previous experience",
    focus: ["Speaking confidence", "Pronunciation"],
    goal: "Travel",
    preferredDate: "2026-04-14",
    availabilityWindows: ["morning"],
    availabilityDays: ["Tue", "Thu"],
    duration: "45 min",
    budget: 40,
    status: "pending",
    createdAt: "2026-04-10T08:00:00.000Z",
  };

  const approvedRequest = {
    id: "req-2",
    userId: "user-2",
    user: {
      id: "user-2",
      name: "Asha Karki",
      full_name: "Asha Karki",
      email: "asha@test.com",
      role: "user",
      country: "Nepal",
      passport_number: "B2345678",
      createdAt: "2026-04-03T09:00:00.000Z",
    },
    level: "Elementary",
    experience: "Self-study only",
    focus: ["Listening comprehension", "Grammar and vocabulary"],
    goal: "Work",
    preferredDate: "2026-04-15",
    availabilityWindows: ["afternoon"],
    availabilityDays: ["Mon", "Wed"],
    duration: "60 min",
    budget: 55,
    status: "approved",
    reviewedAt: "2026-04-10T09:30:00.000Z",
    createdAt: "2026-04-09T10:00:00.000Z",
  };

  const slot = {
    id: "slot-1",
    requestId: approvedRequest.id,
    userId: approvedRequest.userId,
    user: approvedRequest.user,
    date: "2026-04-16",
    time: "7:00 PM",
    description: "Work Nepali demo class with Google Meet",
    meetLink: "https://meet.google.com/demo-slot-1",
    isBooked: true,
    createdAt: "2026-04-10T10:00:00.000Z",
  };

  const booking = {
    id: "booking-1",
    requestId: approvedRequest.id,
    userId: approvedRequest.userId,
    user: approvedRequest.user,
    slot: {
      id: slot.id,
      date: slot.date,
      time: slot.time,
      description: slot.description,
      meetLink: slot.meetLink,
    },
    createdAt: "2026-04-10T10:05:00.000Z",
  };

  return {
    users: [admin, learner, approvedRequest.user],
    requests: [request, approvedRequest],
    slots: [slot],
    bookings: [booking],
  };
};

const readRawState = () => {
  if (typeof localStorage === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const persistState = (state) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const emitChange = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("demo-workflow-updated"));
};

const getCurrentAuthUser = () => {
  if (typeof localStorage === "undefined") return null;

  try {
    return normalizeUser(JSON.parse(localStorage.getItem("user") || "null"));
  } catch {
    return null;
  }
};

const ensureCollections = (state) => ({
  users: Array.isArray(state?.users) ? state.users : [],
  requests: Array.isArray(state?.requests) ? state.requests : [],
  slots: Array.isArray(state?.slots) ? state.slots : [],
  bookings: Array.isArray(state?.bookings) ? state.bookings : [],
});

const ensureUserInState = (state, user) => {
  const normalizedUser = normalizeUser(user);
  if (!normalizedUser) return state;

  const nextUsers = state.users.filter(
    (item) => item.email !== normalizedUser.email,
  );
  nextUsers.unshift(normalizedUser);

  return {
    ...state,
    users: nextUsers,
  };
};

const getState = () => {
  const raw = readRawState();
  const state = ensureCollections(raw || seedState());
  const withCurrentUser = ensureUserInState(state, getCurrentAuthUser());
  if (!raw) {
    persistState(withCurrentUser);
  }
  return withCurrentUser;
};

const setState = (nextState) => {
  const normalized = ensureCollections(nextState);
  persistState(normalized);
  emitChange();
  return normalized;
};

const sortNewestFirst = (items) =>
  [...items].sort(
    (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
  );

const sameUser = (itemUser, currentUser) => {
  if (!itemUser || !currentUser) return false;
  return itemUser.email === currentUser.email || itemUser.id === currentUser.id;
};

export const getDemoState = () => getState();

export const submitDemoRequest = (requestPayload, currentUser) => {
  const user = normalizeUser(currentUser || getCurrentAuthUser());
  const state = ensureUserInState(getState(), user);
  const request = {
    id: createId("req"),
    userId: user?.id || createId("user"),
    user: user || {
      id: createId("user"),
      name: "Learner",
      full_name: "Learner",
      email: "",
      role: "user",
      country: "",
      passport_number: "",
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

  return setState({
    ...state,
    requests: [request, ...state.requests],
  });
};

export const getAdminUsers = () => sortNewestFirst(getState().users);

export const deleteAdminUser = (userId) => {
  const state = getState();
  const currentUser = getCurrentAuthUser();
  const nextUsers = state.users.filter((user) => user.id !== userId);

  return setState({
    ...state,
    users: currentUser?.id === userId ? state.users : nextUsers,
  });
};

export const getAdminRequests = () => sortNewestFirst(getState().requests);

export const reviewDemoRequest = (requestId) => {
  const state = getState();
  const nextRequests = state.requests.map((request) =>
    request.id === requestId
      ? { ...request, status: "approved", reviewedAt: nowIso() }
      : request,
  );

  return setState({ ...state, requests: nextRequests });
};

export const getApprovedDemoRequests = () =>
  sortNewestFirst(
    getState().requests.filter((request) => request.status === "approved"),
  );

export const createDemoSlot = ({
  requestId = null,
  date,
  time,
  meetLink,
  description,
}) => {
  const state = getState();
  const linkedRequest = requestId
    ? state.requests.find((request) => request.id === requestId)
    : null;
  const user =
    linkedRequest?.user || normalizeUser(getCurrentAuthUser()) || null;
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

  const booking = user
    ? {
        id: createId("booking"),
        requestId: requestId || null,
        userId: user.id,
        user,
        slot: {
          id: slot.id,
          date: slot.date,
          time: slot.time,
          description: slot.description,
          meetLink: slot.meetLink,
        },
        createdAt: nowIso(),
      }
    : null;

  const nextRequests = linkedRequest
    ? state.requests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: "scheduled",
              scheduledSlotId: slot.id,
              scheduledAt: nowIso(),
            }
          : request,
      )
    : state.requests;

  const nextState = {
    ...state,
    slots: [slot, ...state.slots],
    requests: nextRequests,
    bookings: booking ? [booking, ...state.bookings] : state.bookings,
  };

  return setState(nextState);
};

export const deleteAdminSlot = (slotId) => {
  const state = getState();
  const slot = state.slots.find((item) => item.id === slotId);
  const nextSlots = state.slots.filter((item) => item.id !== slotId);
  const nextBookings = state.bookings.filter(
    (booking) => booking.slot?.id !== slotId,
  );
  const nextRequests = slot?.requestId
    ? state.requests.map((request) =>
        request.id === slot.requestId
          ? {
              ...request,
              status: "approved",
              scheduledSlotId: null,
              scheduledAt: null,
            }
          : request,
      )
    : state.requests;

  return setState({
    ...state,
    slots: nextSlots,
    bookings: nextBookings,
    requests: nextRequests,
  });
};

export const getAdminSlots = () => sortNewestFirst(getState().slots);

export const getAdminBookings = () => sortNewestFirst(getState().bookings);

export const cancelAdminBooking = (bookingId) => {
  const state = getState();
  const nextBookings = state.bookings.filter(
    (booking) => booking.id !== bookingId,
  );
  const booking = state.bookings.find((item) => item.id === bookingId);
  const nextSlots = booking?.slot?.id
    ? state.slots.filter((slot) => slot.id !== booking.slot.id)
    : state.slots;

  return setState({
    ...state,
    bookings: nextBookings,
    slots: nextSlots,
  });
};

export const getUserRequests = (currentUser) => {
  const user = normalizeUser(currentUser || getCurrentAuthUser());
  if (!user) return [];

  return sortNewestFirst(
    getState().requests.filter((request) => sameUser(request.user, user)),
  );
};

export const getUserBookings = (currentUser) => {
  const user = normalizeUser(currentUser || getCurrentAuthUser());
  if (!user) return [];

  return sortNewestFirst(
    getState().bookings.filter((booking) => sameUser(booking.user, user)),
  );
};

export const getAdminDashboardStats = () => {
  const state = getState();
  const pendingRequests = state.requests.filter(
    (request) => request.status === "pending",
  ).length;
  const approvedRequests = state.requests.filter(
    (request) => request.status === "approved",
  ).length;

  return {
    users: state.users.length,
    requests: state.requests.length,
    pendingRequests,
    approvedRequests,
    slots: state.slots.length,
    bookings: state.bookings.length,
  };
};
