const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/locationController');

// Cliente
router.get('/cliente/:id', ctrl.getCliente);
// Cuidador
router.get('/cuidador/:id', ctrl.getCuidador);
// Vinculos
router.get('/vinculo/cliente/:id', ctrl.getVinculoByCliente);
router.get('/vinculo/cuidador/:id', ctrl.getVinculoByCuidador);

// Localização
router.post('/localizacao/cuidador', ctrl.postLocalizacaoCuidador);
router.get('/localizacao/cliente/:id', ctrl.getLocalizacaoCliente);

module.exports = router;
