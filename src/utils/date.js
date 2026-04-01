const LONG_DATE_FORMAT = {
  weekday: 'short',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
};

const SHORT_DATE_TIME_FORMAT = {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

const SHORT_DATE_FORMAT = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};

const toDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatLongDate = (value) => {
  const date = toDate(value);
  return date ? date.toLocaleDateString('en-US', LONG_DATE_FORMAT) : value;
};

export const formatShortDateTime = (value) => {
  const date = toDate(value);
  return date ? date.toLocaleDateString('en-US', SHORT_DATE_TIME_FORMAT) : value;
};

export const formatShortDate = (value) => {
  const date = toDate(value);
  return date ? date.toLocaleDateString('en-US', SHORT_DATE_FORMAT) : value;
};
