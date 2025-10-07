import { getUserIds } from "./users.mjs";
/**
 * Creates and populates the user selection dropdown with users 1-5
 * @returns {void} Nothing is returned
 * @example
 * createUserDropdown();
 */

export function createUserDropdown() {
  const userSelect = document.getElementById("userSelect");
  
  // Clear existing options
  userSelect.innerHTML = "";

  // Get user IDs
  const userIds = getUserIds();

  // Set the default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "Please select a user";
  userSelect.appendChild(defaultOption);

  // Populate dropdown with user options
  userIds.forEach((userId) => {
    const userOption = document.createElement("option");
    userOption.value = userId;
    userOption.text = `User ${userId}`;
    userSelect.appendChild(userOption);
  });
}
