const nodemailer = require("nodemailer");

async function sendNotificationEmail(subject, message, shopkeeperEmail = "") {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vijayguhan10@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // Try to extract details from the message string
  let details = {};
  let detailsHtml = "";
  try {
    // Try to extract JSON after "Details:"
    const match = message.match(/Details:\s*(\{.*\})$/s);
    if (match) {
      details = JSON.parse(match[1]);
    }
  } catch {
    details = {};
  }

  // Build a nice HTML table for details if possible
  if (Object.keys(details).length > 0) {
    detailsHtml = `
      <table style="border-collapse: collapse; margin-top:10px;">
        ${Object.entries(details)
          .map(
            ([key, value]) => `
            <tr>
              <td style="padding:4px 8px; font-weight:bold; text-align:right; vertical-align:top; border-bottom:1px solid #eee;">${key}:</td>
              <td style="padding:4px 8px; border-bottom:1px solid #eee;">${
                typeof value === "object"
                  ? `<pre style="background:#f4f4f4;padding:8px;border-radius:4px;">${JSON.stringify(
                      value,
                      null,
                      2
                    )}</pre>`
                  : value
              }</td>
            </tr>
          `
          )
          .join("")}
      </table>
    `;
  } else {
    detailsHtml = `<pre style="background:#f4f4f4;padding:8px;border-radius:4px;">${message}</pre>`;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; color: #222; max-width:600px; margin:auto;">
      <div style="background:#1976d2; color:#fff; padding:16px 24px; border-radius:8px 8px 0 0;">
        <h1 style="margin:0; font-size:1.6em;">Tyre Request Order</h1>
      </div>
      <div style="background:#fff; border:1px solid #e0e0e0; border-top:0; border-radius:0 0 8px 8px; padding:24px;">
        <h2 style="color:#1976d2; margin-top:0;">${subject}</h2>
        <p style="font-size:1.1em;">A tyre request has been processed successfully. Please find the details below:</p>
        ${detailsHtml}
        <p style="margin-top:32px; font-size:1.05em;">Thank you for your business.<br><b>revozen-team</b></p>
      </div>
    </div>
  `;

  let mailOptions = {
    from: '"Tyre Backend" <vijayguhan10@gmail.com>',
    to: `vijayguhan10@gmail.com, business.revozen@gmail.com${
      shopkeeperEmail ? `, ${shopkeeperEmail}` : ""
    }`,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", mailOptions.to);
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
  }
}

module.exports = { sendNotificationEmail };
