const { auth, db, messaging } = require('../config/firebaseAdmin');
const UsuarioModel = require('../models/UsuarioModel');
const CuidadorModel = require('../models/CuidadorModel');
const ClienteModel = require('../models/ClienteModel');
const bcrypt = require("bcryptjs");

async function cadastrarUsuario(req, res) {
  try {
    const { nome, email, telefone, senha, tipo_usuario } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Campos obrigatórios não preenchidos" });
    }
    if (!["cuidador", "cliente"].includes(tipo_usuario)) {
      return res.status(400).json({ error: "Tipo de usuário inválido" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await UsuarioModel.create({ nome, email, telefone, senha: senhaHash });

    if (tipo_usuario === "cuidador") {
      await CuidadorModel.create({ usuario_id: usuario.id });
    } else {
      await ClienteModel.create({ usuario_id: usuario.id });
    }

    res.json({
      success: true,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo_usuario }
    });

  } catch (err) {
    console.error("Erro no cadastro:", err);
    res.status(500).json({ error: "Erro interno no cadastro" });
  }
}

async function loginGoogle(req, res) {
  try {
    const { token, tipo_usuario } = req.body;

    if (!token) return res.status(400).json({ error: "Token não fornecido" });
    if (!["cuidador", "cliente"].includes(tipo_usuario))
      return res.status(400).json({ error: "Tipo de usuário inválido" });

    const decoded = await auth.verifyIdToken(token);
    const { uid, email, name } = decoded;

    if (!email) return res.status(400).json({ error: "Email não encontrado no token" });

    let usuario = await UsuarioModel.findOrCreateByFirebase(uid, email, name || 'Usuário');

    if (tipo_usuario === "cuidador") {
      const existente = await CuidadorModel.getById(usuario.id);
      if (!existente) await CuidadorModel.create({ usuario_id: usuario.id });
    } else {
      const existente = await ClienteModel.getById(usuario.id);
      if (!existente) await ClienteModel.create({ usuario_id: usuario.id });
    }

    res.json({
      success: true,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo_usuario }
    });

  } catch (err) {
    console.error("Erro no login Google:", err);
    res.status(500).json({ error: "Erro interno no login" });
  }
}

module.exports = { cadastrarUsuario, loginGoogle };
