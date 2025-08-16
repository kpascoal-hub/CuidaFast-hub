const express = require('express');
const router = express.Router();

const cadastroController = require('../controllers/api-cadastro');

// Rota POST para cadastro
router.post('/cadastro', cadastroController.cadastrarUsuario);

module.exports = router;

