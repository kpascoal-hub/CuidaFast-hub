const express = require("express");
const router = express.Router();
const { sendNotification, sendNotificationToSpecificUser } = require("../controllers/notificationControllers");

/**
 * POST /api/notificacoes/enviar
 * Enviar notificação para todos os usuários
 * Body: { title: string, body: string }
 */
router.post("/enviar", sendNotification);

/**
 * POST /api/notificacoes/enviar-usuario
 * Enviar notificação para um usuário específico
 * Body: { userId: number, title: string, body: string }
 */
router.post("/enviar-usuario", sendNotificationToSpecificUser);

module.exports = router;
