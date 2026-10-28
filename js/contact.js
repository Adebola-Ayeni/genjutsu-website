(() => {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("contact-status");
  const submit = document.getElementById("contact-submit");
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form).entries());
    status.textContent = "Sending your message…";
    status.className = "form-status";
    submit.disabled = true;
    submit.setAttribute("aria-busy", "true");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Your message could not be sent. Please try again later.");
      form.reset();
      status.textContent = "Message sent. Thanks for reaching out to Genjutsu.";
      status.classList.add("is-success");
    } catch (error) {
      status.textContent = error.message || "Message not sent. Please try again later.";
      status.classList.add("is-error");
    } finally {
      submit.disabled = false;
      submit.removeAttribute("aria-busy");
    }
  });
})();
