const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// POST /api/cliente/dados-complementares
router.post('/dados-complementares', clienteController.salvarDadosComplementares);

module.exports = router;