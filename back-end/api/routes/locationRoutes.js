const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/locationController');
const verifyFirebaseIdToken = require('../middleware/verifyFirebaseIdToken');

// Cliente
router.get('/cliente/:id', ctrl.getCliente);
// Cuidador
router.get('/cuidador/:id', ctrl.getCuidador);
// Vinculos
router.get('/vinculo/cliente/:id', ctrl.getVinculoByCliente);
router.get('/vinculo/cuidador/:id', ctrl.getVinculoByCuidador);

// Localização
router.post('/localizacao/cuidador', verifyFirebaseIdToken, ctrl.postLocalizacaoCuidador);
router.get('/localizacao/cliente/:id', ctrl.getLocalizacaoCliente);

// Novas rotas autenticadas
router.post('/cliente/endereco', verifyFirebaseIdToken, ctrl.postClienteEndereco);
router.get('/cliente/me', verifyFirebaseIdToken, ctrl.getClienteMe);
router.get('/localizacao/cuidador/:firebaseUid', verifyFirebaseIdToken, ctrl.getLocalizacaoCuidadorByUid);

// Sanity test (dev only)
router.post('/sanity/firestore-test', verifyFirebaseIdToken, ctrl.sanityFirestoreTest);

module.exports = router;
