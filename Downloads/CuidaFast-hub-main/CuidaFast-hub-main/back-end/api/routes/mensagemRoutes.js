const express = require('express');
const router = express.Router();
const mensagemController = require('../controllers/mensagemController');

// POST /api/mensagens - Enviar nova mensagem
router.post('/', mensagemController.enviarMensagem);

// GET /api/mensagens/conversas/:usuario_id - Buscar conversas do usuário
router.get('/conversas/:usuario_id', mensagemController.getConversas);

// GET /api/mensagens/:usuario1_id/:usuario2_id - Buscar mensagens entre dois usuários
router.get('/:usuario1_id/:usuario2_id', mensagemController.getMensagens);

// GET /api/mensagens/nao-lidas/:usuario_id - Contar mensagens não lidas
router.get('/nao-lidas/:usuario_id', mensagemController.contarNaoLidas);

// GET /api/mensagens/buscar - Buscar usuários para iniciar conversa
router.get('/buscar', mensagemController.buscarUsuarios);

// DELETE /api/mensagens/:id - Deletar mensagem
router.delete('/:id', mensagemController.deletarMensagem);

module.exports = router;
