// ~/www/back-end/API/routes/exemploRoutes.js
const express = require('express');
const router = express.Router();
const exemploController = require('../controllers/exemploController');

router.get('/data-atual', exemploController.getDataFormatada);

module.exports = router;
