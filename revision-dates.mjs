/**
 * Calculate revision dates based on spaced repetition
 * @param {string} inputDate - The starting date in YYYY-MM-DD format
 * @returns {Object} An object with the revision dates
 */

 export function calculateRevisionDates(inputDate) {
    if (!inputDate) throw new Error("Date is required");

    // Parse date parts manually from the input ISO date
    const [year, month, day] = inputDate.split("-").map(Number);

     // Create base date in UTC
    const baseDate = new Date(Date.UTC(year, month - 1, day));

    // Format date back to ISO string YYYY-MM-DD
    const formatToISO = (date) => date.toISOString().split("T")[0];

    // Create new UTC dates to avoid incorrectly adjusted issues
    // const createUTCDate = (y, m, d) => new Date(Date.UTC(y, m, d));

    // NB: the month parameter is zero-based in JS Date therefore is adjusted first
    return {
        oneWeek: formatToISO(new Date(Date.UTC(year, month - 1, day + 7))),
        oneMonth: formatToISO(new Date(Date.UTC(year, month, day))),
        threeMonths: formatToISO(new Date(Date.UTC(year, month + 2, day))),
        sixMonths: formatToISO(new Date(Date.UTC(year, month + 5, day))),
        oneYear: formatToISO(new Date(Date.UTC(year + 1, month - 1, day)))
    };

  };

