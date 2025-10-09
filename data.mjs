import { createUserDropdown } from "./user-dropdown.mjs";
import { addData, clearData, getData } from "./storage.mjs";
import { handleForm } from "./form.mjs";




/**
 * Adds an ordinal suffix (st, nd, rd, th) to a date string for rendering.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string with an ordinal suffix.
 */

function formatDate(isoDate) {
  // If no date is provided, return a dash symbol
  if (!isoDate) return "—";

  const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Split the ISO date into parts
    const [year, monthNum, dayNum] = isoDate.split('-');

    // Create a Date object from the ISO string
    const date = new Date(Date.UTC(year, monthNum - 1, dayNum));

    const day = date.getUTCDate(); 
    const month = months[date.getUTCMonth()]; 
    const fullYear = date.getUTCFullYear(); 

    // Determine the right suffix for the day number (st, nd, rd, th)
    let suffix = "th"
    // Special case for 11th, 12th, 13th
    if (day % 10 === 1 && day !== 11) suffix = "st";
    if (day % 10 === 2 && day !== 12) suffix = "nd";
    if (day % 10 === 3 && day !== 13) suffix = "rd";

  // Return the date in the new format
  return `${day}${suffix} ${month} ${fullYear}`;
}

/**
 * Filters out past dates and sorts input dates into chronological order
 * @param {Array} userData - The user data array
 * @returns {Array} The filtered and sorted user data
 */
export function filterAndSortData(userData) {
  
  // Get today's date as a Date object to compare with revision dates
  const today = new Date();
  // Create a UTC date for today at midnight to avoid timezone issues
  const todayUTC = new Date(Date.UTC(
    today.getUTCFullYear(), 
    today.getUTCMonth(), 
    today.getUTCDate()
  ));


  // Create an array to hold ALL revision dates
  const allRevisionDates = [];
  
  //Go through each item in teh userData array
  userData.forEach(item => {
    // Add all revision dates that are today or in the future
    Object.entries(item.revisionDates || {}).forEach(([key, date]) => {
      //create UTC date for comparison
      const [year, month, day] = date.split('-').map(Number);
      const revisionDate = new Date(Date.UTC(year, month - 1, day));

      if (revisionDate >= todayUTC) {
        allRevisionDates.push({
          topic: item.topic,
          date: date,   // Keep original ISO string
          type: key   // e.g. 'oneWeek', 'oneMonth', etc.
        });
      }
    });
  });


  // Sort revision dates using UTC in chronological order
  return allRevisionDates.sort((a, b) => {
    // Parse date parts manually from the ISO strings to avoid timezone issues
    const [yearA, monthA, dayA] = a.date.split('-').map(Number);
    const [yearB, monthB, dayB] = b.date.split('-').map(Number);

    // Create UTC dates for accurate comparison
    const dateA = new Date(Date.UTC(yearA, monthA - 1, dayA));
    const dateB = new Date(Date.UTC(yearB, monthB - 1, dayB));
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
    if (!Array.isArray(userData)|| !displayElement) return;


    // Render the revision dates as a list
    const userInfoCard = `
    <ul>
      ${userData.map(item => 
        `<li><strong>${item.topic}</strong>: ${formatDate(item.date)}</li>`
      ).join('\n')}
    </ul>
  `;

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
