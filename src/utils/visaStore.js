import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const http = async ({ url, method = "GET", data }) => {
  const response = await client.request({ url, method, data });
  return response.data;
};

const nowIso = () => new Date().toISOString();
const createId = (prefix) => `${prefix}-${crypto.randomUUID()}`;

const sortNewestFirst = (items) =>
  [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

/** Shared user fields pulled from the account */
const userFields = (currentUser) => ({
  fullName: currentUser.full_name || currentUser.name,
  email: currentUser.email,
  nationality: currentUser.country,
  passportNumber: currentUser.passport_number,
});

// ═══════════════════════════════════════════════════════════════
// LEARNER — INCOMING (original, untouched payload shape)
// ═══════════════════════════════════════════════════════════════

/**
 * submitVisaRequest(formData, currentUser)
 * Pulls personal info from the existing user account —
 * only collects what signup didn't already capture.
 */
export const submitVisaRequest = async (formData, currentUser) => {
  const newRequest = {
    id: createId("visa"),
    userId: currentUser.id,
    serviceType: "incoming",

    // ── from existing user account (no duplication in form) ──
    ...userFields(currentUser),

    // ── collected from visa form ──
    dateOfBirth: formData.dateOfBirth || "",
    passportExpiry: formData.passportExpiry || "",
    visaType: formData.visaType || "tourist",
    arrivalDate: formData.arrivalDate || "",
    duration: formData.duration || "30 days",
    entryMethod: formData.entryMethod || "air",
    purpose: formData.purpose || "",
    visitedBefore: formData.visitedBefore ?? false,
    previousRejection: formData.previousRejection ?? false,
    documentsReady: formData.documentsReady || [],
    phone: formData.phone || "",
    message: formData.message || "",

    status: "pending",
    adminNote: "",
    createdAt: nowIso(),
  };

  return http({ url: "/visaRequests", method: "POST", data: newRequest });
};

// ═══════════════════════════════════════════════════════════════
// LEARNER — STAY SERVICES (new)
// ═══════════════════════════════════════════════════════════════

export const submitStayRequest = async (formData, currentUser) => {
  const newRequest = {
    id: createId("visa"),
    userId: currentUser.id,
    serviceType: "stay",

    ...userFields(currentUser),

    currentVisaType: formData.currentVisaType || "",
    visaExpiryDate: formData.visaExpiryDate || "",
    servicesNeeded: formData.servicesNeeded || [],
    currentLocation: formData.currentLocation || "",
    phone: formData.phone || "",
    message: formData.message || "",

    status: "pending",
    adminNote: "",
    createdAt: nowIso(),
  };

  return http({ url: "/visaRequests", method: "POST", data: newRequest });
};

// ═══════════════════════════════════════════════════════════════
// LEARNER — OUTGOING SERVICES (new)
// ═══════════════════════════════════════════════════════════════

export const submitOutgoingRequest = async (formData, currentUser) => {
  const newRequest = {
    id: createId("visa"),
    userId: currentUser.id,
    serviceType: "outgoing",

    ...userFields(currentUser),

    departureDate: formData.departureDate || "",
    overstay: formData.overstay ?? false,
    servicesNeeded: formData.servicesNeeded || [],
    pickupLocation: formData.pickupLocation || "",
    phone: formData.phone || "",
    message: formData.message || "",

    status: "pending",
    adminNote: "",
    createdAt: nowIso(),
  };

  return http({ url: "/visaRequests", method: "POST", data: newRequest });
};

// ═══════════════════════════════════════════════════════════════
// LEARNER — SHARED QUERIES
// ═══════════════════════════════════════════════════════════════

/** Learner — their own visa requests */
export const getUserVisaRequests = async (currentUser) => {
  if (!currentUser) return [];
  const data = await http({
    url: `/visaRequests?userId=${currentUser.id}&_sort=createdAt&_order=desc`,
  });
  return sortNewestFirst(data);
};

// ═══════════════════════════════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════════════════════════════

/** Admin — all visa requests */
export const getAdminVisaRequests = async () => {
  const data = await http({
    url: "/visaRequests?_sort=createdAt&_order=desc",
  });
  return sortNewestFirst(data);
};

/** Admin — update status + optional note back to user */
export const updateVisaRequestStatus = async (id, status, adminNote = "") => {
  return http({
    url: `/visaRequests/${id}`,
    method: "PATCH",
    data: { status, adminNote, updatedAt: nowIso() },
  });
};

/** Admin — delete a visa request */
export const deleteVisaRequest = async (id) => {
  return http({ url: `/visaRequests/${id}`, method: "DELETE" });
};

/** Admin dashboard stats helper */
export const getVisaStats = async () => {
  const data = await http({ url: "/visaRequests" });
  return {
    total: data.length,
    pending: data.filter((r) => r.status === "pending").length,
    reviewing: data.filter((r) => r.status === "reviewing").length,
    responded: data.filter((r) => r.status === "responded").length,
    completed: data.filter((r) => r.status === "completed").length,
  };
};
