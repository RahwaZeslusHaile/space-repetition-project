import { getUserIds } from "./users.mjs";
import { getData ,addData ,clearData} from "./storage.mjs";;
import {handleForm} from "./form.mjs"
document.addEventListener("DOMContentLoaded", () => {

 const userSelect = document.getElementById("userSelect");
const displayData = document.getElementById("renderedData");
const showDataBtn = document.getElementById("showDataBtn")

/**
 * Show the data for the user if it exists in localStorage
 * @param {string} userId - The user's ID
 * @returns the data or a message if no data found
 */
function createUserDropdown() {
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

/**
 * Filters the input dates and sorts in chronological order
 * @param {Array} userData - The user data array
 * @returns {Array} The filtered and sorted user data
 */
// filter out past dates and sort input dates into chronological order

function filterAndSortData(userData) {
  const todaysDate = new Date().toISOString().split("T")[0];
  
  return userData
    .filter(item => {
      // only include items where inputDate is today or in the future
      return item.date >= todaysDate;
    })
    .sort((a,b) => {
      // oldest first
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateA - dateB 
    })
}

function renderDataCard(userData) {
  const userInfoCard = userData.map ((item, index) => `
  <h2><strong>Topic: ${item.topic}</strong></h2>
    <p>StartingDate: ${item.date}</p>
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

function showDataForUser(userId) {
  const userData = getData(userId);
   
// if there is data stored for the user, render it
  if (userData && userData.length > 0) {
    renderDataCard(filterAndSortData(userData));
  } else {
    displayData.innerHTML = "<p>No data found for this user.</p>";
  }
}

  userSelect.addEventListener("change", (event) => {
    const selectedUser = event.target.value;
      console.log(selectedUser,"selectedUser")

    if (selectedUser) {
      showDataForUser(selectedUser);
    } else {
      displayData.innerHTML = "";
    }
  });
  showDataBtn.addEventListener("click", () => {

  const selectedUser = userSelect.value;
  if (!selectedUser) {
    alert("Please select a user first.");
    return;
  }
  showDataForUser(selectedUser);
});

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


handleForm((loadedData) => {
  const userId = userSelect.value.trim();
  if (!userId) {
    alert("Please select a user first.");
    return;
}
  addData(userId, [loadedData]);

  showDataForUser(userId);
});
})