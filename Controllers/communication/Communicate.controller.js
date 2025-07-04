const OptInUser = require("../../Models/communication/Optin");
const Message = require("../../Models/communication/Messages");

// Opt-In Save (from your API, not from Gupshup)
exports.saveOptIn = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).send("Phone number is required.");

    const user = await OptInUser.findOneAndUpdate(
      { phoneNumber },
      { consent: true, optedInAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Opt-in saved successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving opt-in");
  }
};

// Webhook receiver from Gupshup
exports.receiveMessage = async (req, res) => {
  try {
    console.log("Incoming Webhook:", JSON.stringify(req.body, null, 2));

    const { type, payload } = req.body;

    const messageData = {
      phoneNumber: payload?.source || "",
      messageText: payload?.payload?.text || "",
      messageType: payload?.type || type,
      messageId: payload?.id || "",
      externalMessageId: payload?.externalMessageId || "",
      eventType: payload?.event || type,
      timestamp: new Date(payload?.timestamp || Date.now()),
    };

    // ✅ Respond IMMEDIATELY to Gupshup
    res.status(200).send(); // Always send 200 OK with no body

    // Then save asynchronously (fire and forget)
    Message.create(messageData).catch(err => {
      console.error("Error saving message:", err);
    });
  } catch (err) {
    console.error(err);
    // Even on error, respond 200 OK to prevent Gupshup retries
    res.status(200).send();
  }
};
