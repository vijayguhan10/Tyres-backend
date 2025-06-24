const nodemailer = require("nodemailer");

async function sendNotificationEmail({
  userId,
  ShopId,
  comments,
  specification,
  price,
  approvedSpecs,
  totalPrice,
  pushtire,
  shopkeeperEmail,
}) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vijayguhan10@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // Format approved specs as HTML list
  const specsList = Array.isArray(approvedSpecs)
    ? approvedSpecs.map((spec) => `<li>${spec}</li>`).join("")
    : `<li>${approvedSpecs}</li>`;

  // Email body (HTML)
  const html = `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <h2 style="color: #1976d2;">Tyre Order Approval Notification</h2>
      <p>Dear Shopkeeper,</p>
      <p>Your tyre order has been <b>approved</b> with the following details:</p>
      <table style="border-collapse: collapse;">
        <tr><td><b>User ID:</b></td><td>${userId}</td></tr>
        <tr><td><b>Shop ID:</b></td><td>${ShopId}</td></tr>
        <tr><td><b>Comments:</b></td><td>${comments || "N/A"}</td></tr>
        <tr><td><b>Specifications:</b></td><td><ul>${specsList}</ul></td></tr>
        <tr><td><b>Total Price:</b></td><td>₹${totalPrice || price}</td></tr>
      </table>
      <p><b>Order Details:</b></p>
      <pre style="background:#f4f4f4;padding:10px;border-radius:5px;">${JSON.stringify(
        pushtire,
        null,
        2
      )}</pre>
      <p style="margin-top:20px;">Thank you for your business.<br/>Tyre Inventory Team</p>
    </div>
  `;

  let mailOptions = {
    from: '"Tyre Backend" <vijayguhan10@gmail.com>',
    to: `vijayguhan10@gmail.com, business.revozen@gmail.com${
      shopkeeperEmail ? `, ${shopkeeperEmail}` : ""
    }`,
    subject: "Tyre Order Approved - Notification",
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
