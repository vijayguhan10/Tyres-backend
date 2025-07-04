const express = require('express');
const router = express.Router();
const CommunicateController = require('../../Controllers/communication/Communicate.controller');
// router.get('/communication/optin', (req, res) => {
//     res.status(200).send('Webhook is live ✅');
// });

router.post('/optin', CommunicateController.saveOptIn);

router.post('/message', CommunicateController.receiveMessage);

module.exports = router;
