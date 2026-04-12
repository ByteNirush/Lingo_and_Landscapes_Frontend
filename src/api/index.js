const BASE = "http://localhost:3001";

export const getRequests = () =>
  fetch(`${BASE}/demoRequests`).then((r) => r.json());

export const createRequest = (data) =>
  fetch(`${BASE}/demoRequests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      id: crypto.randomUUID(),
      status: "pending",
      createdAt: new Date().toISOString(),
    }),
  }).then((r) => r.json());

export const updateRequestStatus = (id, status) =>
  fetch(`${BASE}/demoRequests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  }).then((r) => r.json());
