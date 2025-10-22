const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const cookieParser = require('cookie-parser');

// certifique-se de ter cookie-parser aplicado no app.js globalmente, mas colocamos aqui só por segurança
router.use(cookieParser());
router.get('/', (req, res) => {
  res.json({ ok: true, rota: 'auth funcionando!' });
});
// registro
router.post('/register', authController.registerValidators, authController.register);

// login
router.post('/login', authController.login);

// refresh token (ler cookie)
router.post('/refresh', authController.refresh);

// logout
router.post('/logout', authController.logout);

module.exports = router;

