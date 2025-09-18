const pool = require('../models/db');

exports.cadastrarUsuario = async (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  if (!nome || !email || !telefone || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO usuario (nome, email, telefone, senha) VALUES (?, ?, ?, ?)',
      [nome, email, telefone, senha]
    );

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', id: result.insertId });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
};
