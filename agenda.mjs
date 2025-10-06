import { getUserIds } from "./users.mjs";
import { calculateRevisionDates } from "./storage.mjs";

// object contains key of topic and date
export const agendas = [
  {
    userId: "1",
    topic: "Introduction to Spaced Repetition",
    inputDate: "2025-07-01",
    revisionDates: [
      "2025-07-08",
      "2025-08-01",
      "2025-11-01",
      "2026-02-01",
      "2026-07-01",
    ],
  },
  {
    userId: "2",
    topic: "Introduction to objects and arrays",
    inputDate: "2025-07-02",
    revisionDates: [
      "2025-07-09",
      "2025-08-02",
      "2025-11-02",
      "2026-02-02",
      "2026-07-02",
    ],
  },
  {
    userId: "3",
    topic: "What is the DOM?",
    inputDate: "2025-07-03",
    revisionDates: [
      "2025-07-10",
      "2025-08-03",
      "2025-11-03",
      "2026-02-03",
      "2026-07-03",
    ],
  },
  {
    userId: "4",
    topic: "How to fetch data from an API",
    inputDate: "2025-07-04",
    revisionDates: [
      "2025-07-11",
      "2025-08-04",
      "2025-11-04",
      "2026-02-04",
      "2026-07-04",
    ],
  },
  {
    userId: "5",
    topic: "Introduction to Local Storage",
    inputDate: "2024-11-05",
    revisionDates: [
      "2024-11-12",
      "2024-12-05",
      "2025-03-05",
      "2025-06-05",
      "2025-11-05",
    ],
  },
];

const userSelect = document.getElementById("userSelect");
// function to create user dropdown
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

// function to render the data
export function renderDataCard(data) {
  displayData.innerHTML = `
    <h2>Study Topic: ${data.topic}</h2>
    <p>Initial Date: ${data.inputDate}</p>
    <h3>Revision Dates:</h3>
    <ul>
      <li>1 Week: ${data.revisionDates[0]}</li>
      <li>1 Month: ${data.revisionDates[1]}</li>
      <li>3 Months: ${data.revisionDates[2]}</li>
      <li>6 Months: ${data.revisionDates[3]}</li>
      <li>1 Year: ${data.revisionDates[4]}</li>
    </ul>
  `;
}

// on selecting the user in the dropdown show data for user id
export function showDataForUser(userId, agendas) {
  const userData = agendas.find((agenda) => agenda.userId === userId);

  if (userData) {
    renderDataCard(userData);
  } else {
    displayData.innerHTML = "<p>No data found for this user.</p>";
  }
}

// add the "change" event listener to the dropdown (so enter key can be used)
userSelect.addEventListener("change", (event) => {
  const selectedUser = event.target.value;
  if (selectedUser) {
    showDataForUser(selectedUser, agendas);
  } else {
    displayData.innerHTML = ""; // nothing to display if the default option is selected
  }
});
