import { createUserDropdown } from "./user-dropdown.mjs";
import { addData, clearData, getData } from "./storage.mjs";
import { handleForm } from "./form.mjs";

/**
 * Filters out past dates and sorts input dates into chronological order
 * @param {Array} userData - The user data array
 * @returns {Array} The filtered and sorted user data
 */
export function filterAndSortData(userData) {
  
  // Get today's date as a Date object to compare with revision dates
  const today = new Date();
  
  // Filter out past revision dates for each topic
  const filteredData = userData.map(item => {
    // Create an empty object to hold future revision dates
    const revisionDates = {};
    // Check each revision date object (the key name e.g. "one week", and it's allocated date)
    Object.entries(item.revisionDates || {}).forEach(([key, date]) => {
      // Check if the date in the object is today or in the future
      if (new Date(date) >= today) {
        // Add only the future revision date to the revisionDates object
        revisionDates[key] = date;
      }
    });
    return {
      // Keep all the original item's properties
      topic: item.topic,           
      inputDate: item.inputDate, 
      // Keep the new filtered revision dates
      revisionDates: revisionDates
    };
  });

  // Sort any input dates in chronological order
  return filteredData.sort((a, b) => {
    const dateA = new Date(a.inputDate);
    const dateB = new Date(b.inputDate);
    return dateA - dateB;
  });
}

/**
 * Renders a data card for a specific user's data.
 * @param {Array} userData - array of user data objects
 * @param {*} displayElement  - the HTML element to render the data into
 */
export function renderDataCard(userData, displayElement) {
  // if userData is not an array, return and exit
  function formatDate(isoDate) {
    if (!isoDate) return "—";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}
    if (!Array.isArray(userData)|| !displayElement) return;


  // renders the HTML for the data
  // (if the revision date exists, show it; if not, show nothing - not even blank lines)
  const userInfoCard = userData.map(data => `
    <h2><strong>Topic: ${data.topic}</strong></h2>
    <p>StartingDate: ${formatDate(data.inputDate)}</p>
    <h3>Upcoming Revision Dates:</h3>
    <ul>
      ${data.revisionDates.oneWeek ? `<li>1 Week: ${formatDate(data.revisionDates.oneWeek)}</li>` : ''}
      ${data.revisionDates.oneMonth ? `<li>1 Month: ${formatDate(data.revisionDates.oneMonth)}</li>` : ''}
      ${data.revisionDates.threeMonths ? `<li>3 Months: ${formatDate(data.revisionDates.threeMonths)}</li>` : ''}
      ${data.revisionDates.sixMonths ? `<li>6 Months: ${formatDate(data.revisionDates.sixMonths)}</li>` : ''}
      ${data.revisionDates.oneYear ? `<li>1 Year: ${formatDate(data.revisionDates.oneYear)}</li>` : ''}
    </ul>
  `).join('<hr>');

  displayElement.innerHTML = userInfoCard;
}

// When the DOM is fully loaded, set up event listeners
document.addEventListener("DOMContentLoaded", () => {
  const userSelect = document.getElementById("userSelect");
  const displayData = document.getElementById("renderedData");
  const clearDataBtn = document.getElementById("clearDataBtn");

  createUserDropdown();

  //Set up event listener for when the user selection changes
  userSelect.addEventListener("change", (event) => {
    const selectedUser = event.target.value;

    // Show data for the selected user
    if (selectedUser) {
      showDataForUser(selectedUser, displayData);
    } else {
      displayData.innerHTML = "";
    }
  });

  // Clear data for the selected user
  clearDataBtn.addEventListener("click", () => {
    const selectedUser = userSelect.value.trim();
    if (!selectedUser) {
      alert("Please select a user first.");
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to clear data for User ${selectedUser}?`);
    if (confirmDelete) {
      clearData(selectedUser);
      displayData.innerHTML = "<p>Data cleared for this user.</p>";
    }
  });

  // Handle form submission
  handleForm((loadedData) => {
    // Get the selected user ID
    const userId = userSelect.value.trim();
    
    if (!userId) {
      alert("Please select a user first.");
      return;
    }
    
    try {
      // Save the new data for the selected user
      addData(userId, [loadedData]);
      showDataForUser(userId, displayData);
    } catch (error) {
      // Display a generic error message if something goes wrong
      alert('Sorry, there was an error saving your data. Please try again.');
    }
  });
});

/**
 * Shows the data for a specific user.
 * @param {*} userId - The ID of the user to show data for.
 * @param {*} displayElement - The HTML element to render the data into.
 */
export function showDataForUser(userId, displayElement) {
  const userData = getData(userId);
   
  // if there is data stored for the user, render it otherwise show a default statement
  if (userData && userData.length > 0) {
    const filteredData = filterAndSortData(userData);
    renderDataCard(filteredData, displayElement);
  } else {
    displayElement.innerHTML = "<p>No data found for this user.</p>";
  }
}
