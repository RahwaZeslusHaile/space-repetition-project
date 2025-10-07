/**
 * Calculate revision dates based on spaced repetition
 * @param {string} inputDate - The starting date in YYYY-MM-DD format
 * @returns {Object} An object with the revision dates
 */

 export function calculateRevisionDates(inputDate) {
 
    // Convert inputDate string to Date object for calculations
    const baseDate = new Date(inputDate);

    // Convert Date object back to YYYY-MM-DD format
    const todaysDate = (d) => d.toISOString().split("T")[0];

    return {
      oneWeek: todaysDate(new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + 7)),
      oneMonth: todaysDate(new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, baseDate.getDate())),
      threeMonths: todaysDate(new Date(baseDate.getFullYear(), baseDate.getMonth() + 3, baseDate.getDate())),
      sixMonths: todaysDate(new Date(baseDate.getFullYear(), baseDate.getMonth() + 6, baseDate.getDate())),
      oneYear: todaysDate(new Date(baseDate.getFullYear() + 1, baseDate.getMonth(), baseDate.getDate())),
    };
  }
