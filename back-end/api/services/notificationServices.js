const { db, messaging } = require('../../config/firebase');

async function sendNotificationToAll(title, body) {
  try {
    const snapshot = await db.collection("tokens").get();
    const tokens = snapshot.docs.map(doc => doc.data().token);

    if (!tokens.length) return { ok: false, msg: "Nenhum token encontrado" };

    const message = { notification: { title, body }, tokens };
    const response = await messaging.sendMulticast(message);

    return { ok: true, response };
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
    return { ok: false, error: error.message };
  }
}

module.exports = { sendNotificationToAll };
