const { auth } = require('../services/firebaseAdmin');

module.exports = async function verifyFirebaseIdToken(req, res, next) {
  try {
    const header = req.headers['authorization'] || req.headers['Authorization'];
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header ausente ou mal formatado' });
    }
    const idToken = header.substring('Bearer '.length).trim();
    const decoded = await auth.verifyIdToken(idToken);
    req.firebaseUid = decoded.uid;
    next();
  } catch (err) {
    console.error('verifyFirebaseIdToken error:', err?.message || err);
    return res.status(401).json({ error: 'Token inválido' });
  }
};
