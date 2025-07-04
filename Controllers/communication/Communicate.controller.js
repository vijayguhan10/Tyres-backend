const OptInUser = require("../../Models/communication/Optin");
const Message = require("../../Models/communication/Messages");

// Opt-In Save (from your API, NOT webhook)
exports.saveOptIn = async (req, res) => {
  try {
    const { phoneNumber, senderName } = req.body;

    if (!phoneNumber) return res.status(400).send("Phone number is required.");

    const user = await OptInUser.findOneAndUpdate(
      { phoneNumber },
      { senderName: senderName || '', consent: true, optedInAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Opt-in saved successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving opt-in");
  }
};

// ✅ Webhook receiver from Gupshup (handles inbound messages)
exports.receiveMessage = async (req, res) => {
  try {
    console.log("Incoming Webhook:", JSON.stringify(req.body, null, 2));

    const { app, timestamp, type, payload } = req.body;

    const messageData = {
      phoneNumber: payload?.source || "",
      senderName: payload?.sender?.name || "",
      messageText: payload?.payload?.text || "",
      messageType: payload?.type || type,
      messageId: payload?.id || "",
      contextId: payload?.context?.id || "",
      gsId: payload?.context?.gsId || "",
      appName: app || "",
      receivedAt: new Date(timestamp || Date.now()),
    };

    // ✅ Respond immediately to Gupshup
    res.status(200).send();

    // Save asynchronously
    await Message.create(messageData);

    // ✅ Optional: Save the sender as opted-in user (auto opt-in on message)
    await OptInUser.findOneAndUpdate(
      { phoneNumber: messageData.phoneNumber },
      { senderName: messageData.senderName, consent: true, optedInAt: new Date() },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error(err);
    res.status(200).send(); // Always respond 200 to avoid retries
  }
};
