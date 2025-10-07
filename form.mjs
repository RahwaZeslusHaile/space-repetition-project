import { calculateRevisionDates } from "./storage.mjs";

export function handleForm(onSubmit) {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("revisionForm");
    const topic = document.getElementById("topic");
    const date = document.getElementById("date");
    const topicError = document.getElementById("topic-error");
    const dateError = document.getElementById("date-error");
    const success = document.getElementById("success");

    const today = new Date().toISOString().split("T")[0];
    date.value = today
    
   
const resetError=()=>{
      topicError.textContent = "";
      dateError.textContent = "";
      topicError.classList.add("hidden");
      dateError.classList.add("hidden");
      success.classList.add("hidden");
}
 form.addEventListener("submit", (event) => {
      event.preventDefault();
      resetError()
      let valid =true;

      if (!topic.value.trim()) {
        topicError.textContent = "Topic is required.";
        topicError.classList.remove("hidden");
        topic.focus();
        valid = false;
      }

      if (!date.value) {
        dateError.textContent = "Date is required.";
        dateError.classList.remove("hidden");
        if (valid) date.focus();
        valid = false;
      }

      if (!valid) return;

      const loadedData = {
        topic: topic.value.trim(),
        date: date.value,
        revisionDates: calculateRevisionDates(date.value)

      };

     if(typeof onSubmit === "function"){
      onSubmit(loadedData)
     }      
      success.textContent = `
        Saved: ${loadedData.topic} — ${loadedData.date}
        (Next revision: ${loadedData.revisionDates.oneWeek})
      `;
      
      success.classList.remove("hidden");

      console.log("Form submitted", loadedData);
      console.log("Revision dates:", loadedData.revisionDates);
      
      topic.value = "";
      date.value = today;
      document.activeElement.blur();
         });

    [topic, date].forEach((el) => {
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
      });
    });
  });
}
