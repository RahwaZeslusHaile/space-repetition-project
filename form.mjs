import { calculateRevisionDates } from "./revision-dates.mjs";


/**
 * Handles the submission of the data for the revision form.
 * @param {function} callback - The callback function to call with the form data.
 */

export function handleForm(callback) {
  // Get form elements
    const form = document.getElementById("revisionForm");
    const topic = document.getElementById("topic");
    const date = document.getElementById("date");
    const topicError = document.getElementById("topic-error");
    const dateError = document.getElementById("date-error");
    const success = document.getElementById("success");

    // Set default date to today
    const today = new Date().toISOString().split("T")[0];
    date.value = today;

    // Reset error messages and hide them
    const resetError=()=>{
          topicError.textContent = "";
          dateError.textContent = "";
          topicError.classList.add("hidden");
          dateError.classList.add("hidden");
    }

    // Handle form submission
    form.addEventListener("submit", (event) => {
        // Prevent page reload
        event.preventDefault();
        // Hide success message and reset errors
        resetError()
        let valid =true;

        // Validate inputs
        if (!topic.value.trim()) {
          topicError.textContent = "Topic is required.";
          topicError.classList.remove("hidden");
          topic.focus();
          valid = false;
        }

        // Validate date
        if (!date.value) {
          dateError.textContent = "Date is required.";
          dateError.classList.remove("hidden");
          if (valid) date.focus();
          valid = false;
        }
        // If not valid, exit early
        if (!valid) return;

        // Prepare the data object to be saved
        const loadedData = {
          topic: topic.value.trim(),
          inputDate: date.value,
          revisionDates: calculateRevisionDates(date.value)
        };

        // Get the selected user and save the data
        const userSelect = document.getElementById("userSelect");
        const selectedUserId = userSelect.value;
        
        // Call the callback function to save data
        if (callback) {
            callback(loadedData);
        }

        // Reset form fields
        topic.value = "";
        date.value = today;
        // blur the active element to remove focus
        document.activeElement.blur();
  });
    
  // Allow form submission with Enter key in either field
  [topic, date].forEach((el) => {
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        // Prevent default to avoid double submission
        e.preventDefault();
        //set the behavior to be the same as a submit button (bubble up the event)
        form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    });
  });
}
