// This file is deprecated. Use src/utils/backendApi.js for all API calls.
// Keeping this file for backward compatibility only.

export const getRequests = () => {
  console.warn('getRequests is deprecated. Use backendApi.getRequests() instead');
  return Promise.reject(new Error('Deprecated API - use backendApi'));
};

export const createRequest = () => {
  console.warn('createRequest is deprecated. Use backendApi.createRequest() instead');
  return Promise.reject(new Error('Deprecated API - use backendApi'));
};

export const updateRequestStatus = () => {
  console.warn('updateRequestStatus is deprecated. Use backendApi.updateRequestStatus() instead');
  return Promise.reject(new Error('Deprecated API - use backendApi'));
};
