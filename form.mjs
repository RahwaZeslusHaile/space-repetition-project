import { calculateRevisionDates } from "./storage.mjs";

export function handleForm() {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("revisionForm");
    const topic = document.getElementById("topic");
    const date = document.getElementById("date");
    const topicError = document.getElementById("topic-error");
    const dateError = document.getElementById("date-error");
    const success = document.getElementById("success");

    date.value = new Date().toISOString().split("T")[0];

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      let valid = true;
      topicError.textContent = "";
      dateError.textContent = "";
      topicError.classList.add("hidden");
      dateError.classList.add("hidden");
      success.classList.add("hidden");

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

      const payload = {
        topic: topic.value.trim(),
        date: date.value
      };

     
      const revisions = calculateRevisionDates(payload.date);

      
      success.textContent = `
        Saved: ${payload.topic} — ${payload.date}
        (Next revision: ${revisions.oneWeek})
      `;
      success.classList.remove("hidden");

      console.log("Form submitted", payload);
      console.log("Revision dates:", revisions);

     
      return { payload, revisions };
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
