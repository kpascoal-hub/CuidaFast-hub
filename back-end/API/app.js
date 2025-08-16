const express = require('express');
const path = require('path');
const cadastroRoutes = require('./routes/routes-cadastro');

const app = express();

// Middleware para ler JSON do corpo das requisições
app.use(express.json());

// Servir arquivos estáticos (se precisar)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rotas da API prefixadas por /api
app.use('/api', cadastroRoutes);

// Rota teste simples
app.get('/api/teste', (req, res) => {
  res.json({ ok: true });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


