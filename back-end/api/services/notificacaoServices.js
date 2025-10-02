const { db, messaging } = require("../firebase-admin");

async function sendNotificationToAll(title, body) {
  const snapshot = await db.collection("tokens").get();
  const tokens = snapshot.docs.map(doc => doc.data().token);

  if (!tokens.length) {
    return { ok: false, msg: "Nenhum token encontrado" };
  }

  const message = {
    notification: { title, body },
    tokens
  };

  return await messaging.sendMulticast(message);
}

module.exports = { sendNotificationToAll };
