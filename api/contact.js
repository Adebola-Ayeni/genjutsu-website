/* Vercel serverless route for the website contact form. */
const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DESTINATION = "genjutsucodm@gmail.com";

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    return res.status(503).json({ error: "Email is not configured yet. Please try again later." });
  }

  const body = req.body || {};
  // A hidden honeypot field catches basic bot submissions without bothering real visitors.
  if (String(body.website || "").trim()) return res.status(200).json({ ok: true });

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || name.length > 100 || !emailPattern.test(email) || email.length > 254 || !subject || subject.length > 160 || !message || message.length > 5000) {
    return res.status(400).json({ error: "Please check the fields and try again." });
  }

  const safeSubject = subject.replace(/[\r\n]+/g, " ").slice(0, 160);
  const text = [
    "New message from the Genjutsu creator website",
    "",
    `Name: ${name}`,
    `Reply email: ${email}`,
    `Subject: ${safeSubject}`,
    "",
    "Message:",
    message
  ].join("\n");

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [DESTINATION],
        reply_to: email,
        subject: `[Genjutsu Website] ${safeSubject}`,
        text
      })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("[api/contact] Resend error", response.status, result?.message || result?.name || "Unknown error");
      return res.status(502).json({ error: "The email service could not send your message. Please try again later." });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("[api/contact] Request failed", error);
    return res.status(502).json({ error: "The email service is temporarily unavailable." });
  }
};
