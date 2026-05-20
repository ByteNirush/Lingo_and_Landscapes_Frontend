import api from './api';

// Requests
export const createRequest = async (data) => {
  const response = await api.post('/requests', data);
  return response.data;
};

export const getRequests = async () => {
  const response = await api.get('/requests');
  return response.data;
};

export const getUserRequests = async () => {
  const response = await api.get('/requests/my-requests');
  return response.data;
};

export const getApprovedRequests = async () => {
  const response = await api.get('/requests/approved');
  return response.data;
};

export const updateRequestStatus = async (id, status) => {
  const response = await api.patch(`/requests/${id}`, { status });
  return response.data;
};

export const deleteRequest = async (id) => {
  const response = await api.delete(`/requests/${id}`);
  return response.data;
};

// Slots
export const createSlot = async (data) => {
  const response = await api.post('/slots', data);
  return response.data;
};

export const getSlots = async () => {
  const response = await api.get('/slots');
  return response.data;
};

export const deleteSlot = async (id) => {
  const response = await api.delete(`/slots/${id}`);
  return response.data;
};

// Bookings
export const getBookings = async () => {
  const response = await api.get('/bookings');
  return response.data;
};

export const getUserBookings = async () => {
  const response = await api.get('/bookings/my-bookings');
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

// Users
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// Visa
export const submitVisaRequest = async (data) => {
  const response = await api.post('/visa', data);
  return response.data;
};

export const getVisaRequests = async () => {
  const response = await api.get('/visa');
  return response.data;
};

export const getUserVisaRequests = async () => {
  const response = await api.get('/visa/my-requests');
  return response.data;
};

export const updateVisaRequestStatus = async (id, status, adminNote = '') => {
  const response = await api.patch(`/visa/${id}`, { status, adminNote });
  return response.data;
};

export const deleteVisaRequest = async (id) => {
  const response = await api.delete(`/visa/${id}`);
  return response.data;
};

export const getVisaStats = async () => {
  const response = await api.get('/visa/stats');
  return response.data;
};

// Dashboard stats
export const getDashboardStats = async () => {
  const [usersRes, requestsRes, slotsRes, bookingsRes, visaRes] = await Promise.all([
    api.get('/users'),
    api.get('/requests'),
    api.get('/slots'),
    api.get('/bookings'),
    api.get('/visa/stats')
  ]);

  const users = usersRes.data.data || [];
  const requests = requestsRes.data.data || [];
  const slots = slotsRes.data.data || [];
  const bookings = bookingsRes.data.data || [];
  const visaStats = visaRes.data.data || {};

  return {
    users: users.length,
    requests: requests.length,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    approvedRequests: requests.filter(r => r.status === 'approved').length,
    slots: slots.length,
    bookings: bookings.length,
    visaStats
  };
};
