const express = require('express');
const path = require('path');
const cadastroRoutes = require('./routes/cadastroRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // 👈 adiciona
const moment = require('moment'); 

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// suas rotas já existentes
app.use('/cadastroi', cadastroRoutes);

// nova rota de notificações
app.use('/notificacoes', notificationRoutes); // 👈 conecta aqui

// rota simples de teste
app.get('/api/teste', (req, res) => {
  res.json({ ok: true });
});

// rota que retorna a data
app.get('/api/data', (req, res) => {
  const agora = moment().format('DD/MM/YYYY HH:mm');
  res.json({ dataAtual: agora });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
