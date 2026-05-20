// This file is deprecated. Use src/utils/backendApi.js for all API calls.
// Keeping this file for backward compatibility only.

export const cancelAdminBooking = () => {
  console.warn('cancelAdminBooking is deprecated. Use backendApi.cancelBooking() instead');
  return Promise.reject(new Error('Deprecated API - use backendApi'));
};

export const createDemoSlot = () => {
  console.warn('createDemoSlot is deprecated. Use backendApi.createSlot() instead');
  return Promise.reject(new Error('Deprecated API - use backendApi'));
};

export const deleteAdminSlot = () => {
  console.warn('deleteAdminSlot is deprecated. Use backendApi.deleteSlot() instead');
  return Promise.reject(new Error('Deprecated API - use backendApi'));
};

export const deleteAdminUser = () => {
  console.warn('deleteAdminUser is deprecated. Use backendApi.deleteUser() instead');
  return Promise.reject(new Error('Deprecated API - use backendApi'));
};

export const getAdminBookings = () => {
  console.warn('getAdminBookings is deprecated. Use backendApi.getBookings() instead');
  return Promise.reject(new Error('Deprecated API - use backendApi'));
};

export const getAdminDashboardStats = () => {
  console.warn('getAdminDashboardStats is deprecated. Use backendApi.getDashboardStats() instead');
  return Promise.reject(new Error('Deprecated API - use backendApi'));
};

export const getAdminRequests = () => {
  console.warn('getAdminRequests is deprecated. Use backendApi.getRequests() instead');
  return Promise.reject(new Error('Deprecated API - use backendApi'));
};

export const getAdminSlots = () => {
  console.warn('getAdminSlots is deprecated. Use backendApi.getSlots() instead');
  return Promise.reject(new Error('Deprecated API - use backendApi'));
};

export const getAdminUsers = () => {
  console.warn('getAdminUsers is deprecated. Use backendApi.getUsers() instead');
  return Promise.reject(new Error('Deprecated API - use backendApi'));
};

export const reviewDemoRequest = () => {
  console.warn('reviewDemoRequest is deprecated. Use backendApi.updateRequestStatus() instead');
  return Promise.reject(new Error('Deprecated API - use backendApi'));
};
