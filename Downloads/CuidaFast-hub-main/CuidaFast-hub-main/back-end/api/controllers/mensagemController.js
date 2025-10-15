const MensagemModel = require('../models/MensagemModel');

/**
 * Enviar nova mensagem
 */
exports.enviarMensagem = async (req, res) => {
  try {
    const { remetente_id, destinatario_id, conteudo } = req.body;

    if (!remetente_id || !destinatario_id || !conteudo) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }

    const mensagemId = await MensagemModel.create({
      remetente_id,
      destinatario_id,
      conteudo
    });

    return res.status(201).json({
      message: 'Mensagem enviada com sucesso',
      id: mensagemId
    });
  } catch (err) {
    console.error('[MensagemController] Erro ao enviar mensagem:', err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * Buscar conversas do usuário
 */
exports.getConversas = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    if (!usuario_id) {
      return res.status(400).json({ message: 'usuario_id é obrigatório' });
    }

    const conversas = await MensagemModel.getConversas(usuario_id);

    return res.json({
      total: conversas.length,
      conversas: conversas
    });
  } catch (err) {
    console.error('[MensagemController] Erro ao buscar conversas:', err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * Buscar mensagens entre dois usuários
 */
exports.getMensagens = async (req, res) => {
  try {
    const { usuario1_id, usuario2_id } = req.params;

    if (!usuario1_id || !usuario2_id) {
      return res.status(400).json({ message: 'IDs dos usuários são obrigatórios' });
    }

    const mensagens = await MensagemModel.getMensagensEntre(usuario1_id, usuario2_id);

    // Marcar mensagens como lidas
    await MensagemModel.marcarComoLida(usuario2_id, usuario1_id);

    return res.json({
      total: mensagens.length,
      mensagens: mensagens
    });
  } catch (err) {
    console.error('[MensagemController] Erro ao buscar mensagens:', err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * Contar mensagens não lidas
 */
exports.contarNaoLidas = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    if (!usuario_id) {
      return res.status(400).json({ message: 'usuario_id é obrigatório' });
    }

    const total = await MensagemModel.contarNaoLidas(usuario_id);

    return res.json({ total });
  } catch (err) {
    console.error('[MensagemController] Erro ao contar mensagens:', err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * Buscar usuários para iniciar conversa
 */
exports.buscarUsuarios = async (req, res) => {
  try {
    const { termo, tipo } = req.query;

    if (!termo || termo.length < 2) {
      return res.status(400).json({ message: 'Digite pelo menos 2 caracteres para buscar' });
    }

    const usuarios = await MensagemModel.buscarUsuarios(termo, tipo);

    return res.json({
      total: usuarios.length,
      usuarios: usuarios
    });
  } catch (err) {
    console.error('[MensagemController] Erro ao buscar usuários:', err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

/**
 * Deletar mensagem
 */
exports.deletarMensagem = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario_id } = req.body;

    if (!id || !usuario_id) {
      return res.status(400).json({ message: 'ID da mensagem e usuario_id são obrigatórios' });
    }

    const affectedRows = await MensagemModel.delete(id, usuario_id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Mensagem não encontrada ou você não tem permissão' });
    }

    return res.json({ message: 'Mensagem deletada com sucesso' });
  } catch (err) {
    console.error('[MensagemController] Erro ao deletar mensagem:', err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

module.exports = exports;
