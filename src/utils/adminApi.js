import api from './api';

const parsePayload = (responseData) => {
  if (responseData?.success && responseData?.data !== undefined) {
    return responseData.data;
  }
  return responseData;
};

const asArray = (payload, key) => {
  if (Array.isArray(payload)) return payload;
  const candidate = payload?.[key];
  return Array.isArray(candidate) ? candidate : [];
};

const mapSlot = (slot) => ({
  ...slot,
  id: slot?.id ?? slot?._id,
  isBooked: slot?.isBooked ?? slot?.is_booked ?? false,
  meetLink: slot?.meetLink ?? slot?.meet_link ?? '',
});

const mapUser = (user) => ({
  ...user,
  id: user?.id ?? user?._id,
  name: user?.name ?? user?.full_name ?? '',
  createdAt: user?.createdAt ?? user?.created_at,
  country: user?.country ?? '',
  passport_number: user?.passport_number ?? user?.passportNumber ?? '',
  role: user?.role ?? 'user',
});

const mapBooking = (booking) => ({
  ...booking,
  id: booking?.id ?? booking?._id,
});

export const getAdminUsers = async () => {
  const response = await api.get('/admin/users');
  return asArray(parsePayload(response.data), 'users').map(mapUser);
};

export const deleteAdminUser = async (userId) => {
  await api.delete(`/admin/users/${userId}`);
};

export const getAdminSlots = async () => {
  const response = await api.get('/admin/slots');
  return asArray(parsePayload(response.data), 'slots').map(mapSlot);
};

export const createAdminSlot = async (slotPayload) => {
  await api.post('/admin/slots', slotPayload);
};

export const deleteAdminSlot = async (slotId) => {
  await api.delete(`/admin/slots/${slotId}`);
};

export const getAdminBookings = async () => {
  const response = await api.get('/admin/bookings');
  return asArray(parsePayload(response.data), 'bookings').map(mapBooking);
};

export const cancelAdminBooking = async (bookingId) => {
  await api.delete(`/admin/bookings/${bookingId}`);
};

export const getAdminDashboardStats = async () => {
  const [users, slots, bookings] = await Promise.all([
    getAdminUsers(),
    getAdminSlots(),
    getAdminBookings(),
  ]);

  return {
    users: users.length,
    slots: slots.length,
    bookings: bookings.length,
    available: slots.filter((slot) => !slot.isBooked).length,
  };
};
