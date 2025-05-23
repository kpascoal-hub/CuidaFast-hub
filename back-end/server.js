const express = require('express');
const path = require('path');
const app = express();

// Servir a pasta front-end com o prefixo /front-end
app.use('/front-end', express.static(path.join(__dirname, '..', 'front-end')));

// Rota raiz para servir o index.html (na pasta pai da front-end)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

const port = 3000;

// Escutar na porta 3000 e em todas as interfaces da máquina (0.0.0.0)
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${port}`);
});

