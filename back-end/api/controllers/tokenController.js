const TokenModel = require('../models/TokenModel');

/**
 * Salvar token FCM do usuário
 */
exports.saveToken = async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ 
        ok: false, 
        message: 'userId e token são obrigatórios' 
      });
    }

    // Verificar se o token já existe para este usuário
    const existingToken = await TokenModel.findByToken(token);
    
    if (existingToken) {
      // Token já existe, apenas retornar sucesso
      return res.json({ 
        ok: true, 
        message: 'Token já cadastrado',
        tokenId: existingToken.id
      });
    }

    // Salvar novo token
    const tokenId = await TokenModel.create(userId, token);

    return res.status(201).json({ 
      ok: true, 
      message: 'Token salvo com sucesso',
      tokenId 
    });

  } catch (error) {
    console.error('[TokenController] Erro ao salvar token:', error);
    
    // Se for erro de duplicata, retornar sucesso mesmo assim
    if (error.code === 'ER_DUP_ENTRY') {
      return res.json({ 
        ok: true, 
        message: 'Token já cadastrado' 
      });
    }
    
    return res.status(500).json({ 
      ok: false, 
      message: 'Erro ao salvar token',
      error: error.message 
    });
  }
};

/**
 * Deletar token FCM
 */
exports.deleteToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        ok: false, 
        message: 'Token é obrigatório' 
      });
    }

    const affectedRows = await TokenModel.deleteByToken(token);

    if (affectedRows === 0) {
      return res.status(404).json({ 
        ok: false, 
        message: 'Token não encontrado' 
      });
    }

    return res.json({ 
      ok: true, 
      message: 'Token deletado com sucesso' 
    });

  } catch (error) {
    console.error('[TokenController] Erro ao deletar token:', error);
    return res.status(500).json({ 
      ok: false, 
      message: 'Erro ao deletar token',
      error: error.message 
    });
  }
};

/**
 * Deletar todos os tokens de um usuário
 */
exports.deleteAllUserTokens = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        ok: false, 
        message: 'userId é obrigatório' 
      });
    }

    const affectedRows = await TokenModel.deleteAllForUser(userId);

    return res.json({ 
      ok: true, 
      message: `${affectedRows} token(s) deletado(s)`,
      deletedCount: affectedRows
    });

  } catch (error) {
    console.error('[TokenController] Erro ao deletar tokens:', error);
    return res.status(500).json({ 
      ok: false, 
      message: 'Erro ao deletar tokens',
      error: error.message 
    });
  }
};
