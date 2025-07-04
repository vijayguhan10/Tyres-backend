const express = require('express');
const router = express.Router();
const CommunicateController = require('../../Controllers/communication/Communicate.controller');

router.post('/optin', CommunicateController.saveOptIn);
router.post('/message', CommunicateController.receiveMessage);

module.exports = router;
