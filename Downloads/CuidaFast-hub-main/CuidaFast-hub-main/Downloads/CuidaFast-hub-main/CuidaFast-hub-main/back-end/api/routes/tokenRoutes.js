const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

/**
 * POST /api/tokens
 * Salvar token FCM do usuário
 * Body: { userId: number, token: string }
 */
router.post('/', tokenController.saveToken);

/**
 * DELETE /api/tokens
 * Deletar token FCM específico
 * Body: { token: string }
 */
router.delete('/', tokenController.deleteToken);

/**
 * DELETE /api/tokens/user/:userId
 * Deletar todos os tokens de um usuário
 * Params: userId
 */
router.delete('/user/:userId', tokenController.deleteAllUserTokens);

module.exports = router;
