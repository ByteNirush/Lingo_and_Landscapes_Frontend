import api from './api';

const ensureSuccessData = (responseData, errorMessage) => {
  if (!responseData?.success || !responseData?.data) {
    throw new Error(errorMessage);
  }

  return responseData.data;
};

const parseAuthData = (responseData, errorMessage) => {
  const data = ensureSuccessData(responseData, errorMessage);

  if (!data?.user || !data?.token) {
    throw new Error(errorMessage);
  }

  return {
    user: data.user,
    token: data.token,
  };
};

const parseProfileData = (responseData, errorMessage) => {
  const data = ensureSuccessData(responseData, errorMessage);

  if (!data?.id || !data?.email || !data?.role) {
    throw new Error(errorMessage);
  }

  return {
    id: data.id,
    full_name: data.full_name,
    email: data.email,
    role: data.role,
    country: data.country,
    passport_number: data.passport_number,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

export const signin = async (payload) => {
  const response = await api.post('/auth/signin', payload);
  return parseAuthData(response.data, 'Invalid signin response');
};

export const signup = async (payload) => {
  const response = await api.post('/auth/signup', payload);
  return parseAuthData(response.data, 'Invalid signup response');
};

export const getProfile = async () => {
  const response = await api.get('/me');
  return parseProfileData(response.data, 'Invalid profile response');
};
