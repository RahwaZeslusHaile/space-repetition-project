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
  const data = JSON.parse(localStorage.getItem(`stored-data-user-${userId}`));
  return data;
}

/**
 * Store data for a specific user. If there was already data for this user, this function preserves it and adds the new data at the end.
 *
 * @param {string} userId The user id to store data for
 * @param {any[]} data The data to store
 */
export function addData(userId, data) {
  // Assign a unique key for the user
  const key = `stored-data-user-${userId}`;

  // Get existing data for the user (or empty array if none)
  const existingData = getData(userId) || [];

  // Check if we received any data to save
  if (data.length === 0) {
    console.log("No data provided to save");
    return;
  }

  // When adding new data, prevent duplicates (same topic + date) for the selected user
  const newData = data.filter(newItem => {
    // Use the some() method to check that at least one item in existingData matches the newItem
    // if a match is found, it's a duplicate and we filter it out
    // if no match is found, it's not a duplicate and we keep it
    const isDuplicate = existingData.some(
      existingItem =>
        existingItem.topic === newItem.topic &&
        existingItem.inputDate === newItem.inputDate
    );
    if (isDuplicate) {
      alert(`Duplicate entry: Topic "${newItem.topic}" already exists for date ${newItem.inputDate}`);
    }
    return !isDuplicate;
  });

  // If all the filtered items were duplicates, exit early
  if (newData.length === 0) {
    alert(`Nothing to save: All items already exist for selected dates.`);
    return;
  }

  // Combine existing data with new data
  const updatedData = existingData.concat(newData);

  // Save updated data back to localStorage
  try {
    localStorage.setItem(key, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Clears all data associated with a specific user. NOTE: This is provided to help with development, and is not required in the final code
 *
 * @param {string} userId The user id to clear associated data for
 */
export function clearData(userId) {
  localStorage.removeItem(`stored-data-user-${userId}`);
}



