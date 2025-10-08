export function calculateRevisionDates(inputDate) {
  if (!inputDate) throw new Error("Date is required");

  const [year, month, day] = inputDate.split("-").map(Number);

  // Validate date parts — reject impossible dates (e.g., 2025-02-30)
  const baseDate = new Date(Date.UTC(year, month - 1, day));
  if (isNaN(baseDate.getTime()) || baseDate.getUTCDate() !== day) {
    throw new Error("Invalid date format");
  }

  const formatToISO = (date) => date.toISOString().split("T")[0];

  // Use setUTCDate and setUTCMonth for safe calendar math (handles leap years)
  const addTime = (date, years = 0, months = 0, days = 0) => {
    const newDate = new Date(date);
    newDate.setUTCFullYear(newDate.getUTCFullYear() + years);
    newDate.setUTCMonth(newDate.getUTCMonth() + months);
    newDate.setUTCDate(newDate.getUTCDate() + days);
    return newDate;
  };

  return {
    oneWeek: formatToISO(addTime(baseDate, 0, 0, 7)),
    oneMonth: formatToISO(addTime(baseDate, 0, 1)),
    threeMonths: formatToISO(addTime(baseDate, 0, 3)),
    sixMonths: formatToISO(addTime(baseDate, 0, 6)),
    oneYear: formatToISO(addTime(baseDate, 1))
  };
}
