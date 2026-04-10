/**
 * Generates a Google Calendar add event URL.
 */
export const generateGoogleCalendarUrl = ({
  title,
  startDate,
  endDate,
  description,
  location,
}) => {
  const formatDate = (date) => {
    const value = new Date(date);
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");
    const hours = String(value.getUTCHours()).padStart(2, "0");
    const minutes = String(value.getUTCMinutes()).padStart(2, "0");
    const seconds = String(value.getUTCSeconds()).padStart(2, "0");
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  };

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    details: description || "",
    location: location || "",
    ctz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Generates an iCal file download for the same event.
 */
export const downloadCalendarFile = ({
  title,
  startDate,
  endDate,
  description,
  location,
}) => {
  const formatDate = (date) => {
    const value = new Date(date);
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");
    const hours = String(value.getUTCHours()).padStart(2, "0");
    const minutes = String(value.getUTCMinutes()).padStart(2, "0");
    const seconds = String(value.getUTCSeconds()).padStart(2, "0");
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  };

  const escapeIcsValue = (value) =>
    String(value || "")
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Lingo and Landscapes//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@lingolandscapes.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${escapeIcsValue(title)}
DESCRIPTION:${escapeIcsValue(description)}
LOCATION:${escapeIcsValue(location)}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${String(title || "calendar-event").replace(/\s+/g, "_")}.ics`;
  link.click();
  URL.revokeObjectURL(url);
};
