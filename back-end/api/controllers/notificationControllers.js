const { sendNotificationToAll } = require("../services/notificationService");

async function sendNotification(req, res) {
  try {
    const { title, body } = req.body;
    const response = await sendNotificationToAll(title, body);
    res.json({ ok: true, response });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}

module.exports = { sendNotification };
