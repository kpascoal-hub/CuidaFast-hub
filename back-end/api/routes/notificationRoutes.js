const express = require('express');
const { sendNotification } = require('../controllers/notificationController');
const router = express.Router();

router.post("/enviar", sendNotification);

module.exports = router;
