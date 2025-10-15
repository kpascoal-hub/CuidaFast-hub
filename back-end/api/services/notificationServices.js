const { messaging } = require("../config/firebase");
const db = require("../models/db");

/**
 * Enviar notificação para todos os usuários cadastrados
 * Lê tokens da tabela: tokens (id, user_id, token, created_at)
 */
async function sendNotificationToAll(title, body) {
  try {
    console.log('[NotificationService] Buscando tokens da tabela tokens...');
    
    // Busca todos os tokens do MySQL
    const [rows] = await db.query('SELECT id, user_id, token FROM tokens');
    
    if (!rows.length) {
      console.log('[NotificationService] Nenhum token encontrado na tabela');
      return { ok: false, msg: "Nenhum token encontrado" };
    }

    const tokens = rows.map(row => row.token);
    console.log(`[NotificationService] ${tokens.length} token(s) encontrado(s)`);

    // Monta a mensagem de notificação
    const message = {
      notification: { title, body },
      tokens,
    };

    // Envia via FCM
    console.log('[NotificationService] Enviando notificação via FCM...');
    const response = await messaging.sendMulticast(message);
    
    console.log(`[NotificationService] Sucesso: ${response.successCount}, Falhas: ${response.failureCount}`);
    
    return { 
      ok: true, 
      response,
      successCount: response.successCount,
      failureCount: response.failureCount,
      totalTokens: tokens.length
    };
  } catch (error) {
    console.error('[NotificationService] Erro ao enviar notificação:', error);
    return { ok: false, msg: error.message };
  }
}

/**
 * Enviar notificação para um usuário específico
 */
async function sendNotificationToUser(userId, title, body) {
  try {
    console.log(`[NotificationService] Buscando tokens do usuário ${userId}...`);
    
    // Busca tokens do usuário específico
    const [rows] = await db.query('SELECT token FROM tokens WHERE user_id = ?', [userId]);
    
    if (!rows.length) {
      console.log(`[NotificationService] Nenhum token encontrado para usuário ${userId}`);
      return { ok: false, msg: "Usuário não tem tokens cadastrados" };
    }

    const tokens = rows.map(row => row.token);
    console.log(`[NotificationService] ${tokens.length} token(s) encontrado(s) para usuário ${userId}`);

    // Monta a mensagem de notificação
    const message = {
      notification: { title, body },
      tokens,
    };

    // Envia via FCM
    const response = await messaging.sendMulticast(message);
    
    console.log(`[NotificationService] Sucesso: ${response.successCount}, Falhas: ${response.failureCount}`);
    
    return { 
      ok: true, 
      response,
      successCount: response.successCount,
      failureCount: response.failureCount
    };
  } catch (error) {
    console.error('[NotificationService] Erro ao enviar notificação:', error);
    return { ok: false, msg: error.message };
  }
}

module.exports = { 
  sendNotificationToAll,
  sendNotificationToUser
};
