import { getUserIds } from "./users.mjs";
import { getData } from "./storage.mjs";


const userSelect = document.getElementById("userSelect");

/**
 * Create the User dropdown
 */

export function createUserDropdown() {
  const userIds = getUserIds();

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "Please select a user";
  userSelect.appendChild(defaultOption);

  userIds.forEach((userId) => {
    const userOption = document.createElement("option");
    userOption.value = userId;
    userOption.text = `User ${userId}`;
    userSelect.appendChild(userOption);
  });
}
createUserDropdown();

// render the data in the div
const displayData = document.getElementById("renderedData");

/**
 * Filters the input dates and sorts in chronological order
 * @param {Array} userData - The user data array
 * @returns {Array} The filtered and sorted user data
 */
// filter out past dates and sort input dates into chronological order
export function filterAndSortData(userData) {
  const todaysDate = new Date().toISOString().split("T")[0];
  
  return userData
    .filter(item => {
      // only include items where inputDate is today or in the future
      return item.inputDate >= todaysDate;
    })
    .sort((a,b) => {
      // oldest first
      const dateA = new Date(a.inputDate)
      const dateB = new Date(b.inputDate)
      return dateA - dateB 
    })
}

// function to render the data
export function renderDataCard(userData) {
  const userInfoCard = userData.map ((item, index) => `
  <h2><strong>Topic: ${item.topic}</strong></h2>
    <p>StartingDate: ${item.inputDate}</p>
    <h3>Revision Dates:</h3>
    <ul>
      <li>1 Week: ${item.revisionDates.oneWeek}</li>
      <li>1 Month: ${item.revisionDates.oneMonth}</li>
      <li>3 Months: ${item.revisionDates.threeMonths}</li>
      <li>6 Months: ${item.revisionDates.sixMonths}</li>
      <li>1 Year: ${item.revisionDates.oneYear}</li>
    </ul>
    `
    ).join("<hr>");
  displayData.innerHTML = userInfoCard;
}

/**
 * Show the data for the user if it exists in localStorage
 * @param {string} userId - The user's ID
 * @returns the data or a message if no data found
 */
// on selecting the user in the dropdown show data for user id
export function showDataForUser(userId) {
  const userData = getData(userId);
// if there is data stored for the user, render it
  if (userData && userData.length > 0) {
    const sortedData = filterAndSortData(userData);
    renderDataCard(sortedData);
  } else {
    displayData.innerHTML = "<p>No data found for this user.</p>";
  }
}

// add the "change" event listener to the dropdown (so enter key can be used)
userSelect.addEventListener("change", (event) => {
  const selectedUser = event.target.value;
  if (selectedUser) {
    showDataForUser(selectedUser);
  } else {
    displayData.innerHTML = ""; // nothing to display if the default option is selected
  }
});


