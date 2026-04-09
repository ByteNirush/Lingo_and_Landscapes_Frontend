export const mapApiError = (error, fallbackMessage = 'Something went wrong') => {
  const responseError = error?.response?.data?.error;

  if (responseError?.message) {
    return responseError.message;
  }

  const validationErrors = responseError?.details?.errors;
  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    return validationErrors[0]?.message || fallbackMessage;
  }

  if (error?.message) {
    return error.message;
  }

  return fallbackMessage;
};
