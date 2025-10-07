// This is a scaffolding file we have provided for you which allows you to manage stored data for your application.
// It can be loaded into index.html.
// You should not need to modify it to complete the project.

/**
 * Get data associated with a specific user.
 *
 * @param {string} userId The user id to get data for
 * @returns {any[] | null} The data associated with the user
 */
export function getData(userId) {
  return JSON.parse(localStorage.getItem(`stored-data-user-${userId}`));
}

/**
 * Store data for a specific user. If there was already data for this user, this function preserves it and adds the new data at the end.
 *
 * @param {string} userId The user id to store data for
 * @param {any[]} data The data to store
 */
export function addData(userId, data) {
  const key = `stored-data-user-${userId}`;
  const existingData = getData(userId) || [];

  // Prevent duplicates (same topic + date)
  const newData = data.filter(newItem => {
    return !existingData.some(
      existingItem =>
        existingItem.topic === newItem.topic &&
        existingItem.date === newItem.date
    );
  });

  if (newData.length === 0) {
    console.log("No new data to add — duplicate detected.");
    return;
  }

  const updatedData = existingData.concat(newData);
  localStorage.setItem(key, JSON.stringify(updatedData));

  console.log(`Data saved for user ${userId}`, updatedData);
}


/**
 * Clears all data associated with a specific user. NOTE: This is provided to help with development, and is not required in the final code
 *
 * @param {string} userId The user id to clear associated data for
 */
export function clearData(userId) {
  localStorage.removeItem(`stored-data-user-${userId}`);
}


/**
 * Calculate revision dates based on spaced repetition
 * @param {string} inputDate - The starting date in YYYY-MM-DD format
 * @returns {Object} An object with the revision dates
 */

 export function calculateRevisionDates(inputDate) {
  if (!inputDate) throw new Error("Date is required");
  const baseDate = new Date(inputDate);
  if (isNaN(baseDate)) throw new Error("Invalid date format");

  const todaysDate = (d) => d.toISOString().split("T")[0];

  return {
    oneWeek: todaysDate(new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + 7)),
    oneMonth: todaysDate(new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, baseDate.getDate())),
    threeMonths: todaysDate(new Date(baseDate.getFullYear(), baseDate.getMonth() + 3, baseDate.getDate())),
    sixMonths: todaysDate(new Date(baseDate.getFullYear(), baseDate.getMonth() + 6, baseDate.getDate())),
    oneYear: todaysDate(new Date(baseDate.getFullYear() + 1, baseDate.getMonth(), baseDate.getDate())),
  };
}
