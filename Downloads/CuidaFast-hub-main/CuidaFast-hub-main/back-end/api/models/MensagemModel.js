const db = require('./db');

class MensagemModel {
  /**
   * Criar nova mensagem
   */
  static async create(mensagem) {
    const { remetente_id, destinatario_id, conteudo } = mensagem;
    const [result] = await db.query(
      `INSERT INTO mensagem (remetente_id, destinatario_id, conteudo, data_envio) 
       VALUES (?, ?, ?, NOW())`,
      [remetente_id, destinatario_id, conteudo]
    );
    return result.insertId;
  }

  /**
   * Buscar conversas de um usuário (lista de contatos com última mensagem)
   */
  static async getConversas(usuario_id) {
    const [rows] = await db.query(
      `SELECT DISTINCT
        CASE 
          WHEN m.remetente_id = ? THEN m.destinatario_id
          ELSE m.remetente_id
        END as contato_id,
        u.nome as contato_nome,
        u.foto_perfil as contato_foto,
        CASE 
          WHEN c.id IS NOT NULL THEN 
            CASE 
              WHEN c.tipos_cuidado LIKE '%idoso%' THEN 'Cuidador de Idosos'
              WHEN c.tipos_cuidado LIKE '%crianca%' THEN 'Babá'
              WHEN c.tipos_cuidado LIKE '%pet%' THEN 'Pet Walker'
              ELSE 'Cuidador'
            END
          ELSE 'Cliente'
        END as contato_tipo,
        (SELECT conteudo FROM mensagem 
         WHERE (remetente_id = ? AND destinatario_id = contato_id) 
            OR (remetente_id = contato_id AND destinatario_id = ?)
         ORDER BY data_envio DESC LIMIT 1) as ultima_mensagem,
        (SELECT data_envio FROM mensagem 
         WHERE (remetente_id = ? AND destinatario_id = contato_id) 
            OR (remetente_id = contato_id AND destinatario_id = ?)
         ORDER BY data_envio DESC LIMIT 1) as data_ultima_mensagem,
        0 as mensagens_nao_lidas
      FROM mensagem m
      JOIN usuario u ON u.id = contato_id
      LEFT JOIN cuidador c ON c.usuario_id = u.id
      WHERE m.remetente_id = ? OR m.destinatario_id = ?
      ORDER BY data_ultima_mensagem DESC`,
[usuario_id, usuario_id, usuario_id, usuario_id, usuario_id, usuario_id, usuario_id]
    );
    return rows;
  }

  /**
   * Buscar mensagens entre dois usuários
   */
  static async getMensagensEntre(usuario1_id, usuario2_id) {
    const [rows] = await db.query(
      `SELECT m.*, 
        u1.nome as remetente_nome,
        u1.foto_perfil as remetente_foto,
        u2.nome as destinatario_nome,
        u2.foto_perfil as destinatario_foto
       FROM mensagem m
       JOIN usuario u1 ON m.remetente_id = u1.id
       JOIN usuario u2 ON m.destinatario_id = u2.id
       WHERE (m.remetente_id = ? AND m.destinatario_id = ?)
          OR (m.remetente_id = ? AND m.destinatario_id = ?)
       ORDER BY m.data_envio ASC`,
      [usuario1_id, usuario2_id, usuario2_id, usuario1_id]
    );
    return rows;
  }

  /**
   * Marcar mensagens como lidas
   */
  static async marcarComoLida(remetente_id, destinatario_id) {
    // Tabela não tem campo 'lida', então apenas retornamos 0
    // Pode ser implementado futuramente se adicionar o campo
    return 0;
  }

  /**
   * Contar mensagens não lidas de um usuário
   */
  static async contarNaoLidas(usuario_id) {
    // Tabela não tem campo 'lida', retorna 0 por enquanto
    // Pode ser implementado futuramente se adicionar o campo
    return 0;
  }

  /**
   * Buscar usuários (cuidadores ou clientes) para iniciar conversa
   */
  static async buscarUsuarios(termo, tipo_usuario) {
    let query = `
      SELECT u.id, u.nome, u.email, u.foto_perfil, u.tipo,
        CASE 
          WHEN c.id IS NOT NULL THEN 
            CASE 
              WHEN c.tipos_cuidado LIKE '%idoso%' THEN 'Cuidador de Idosos'
              WHEN c.tipos_cuidado LIKE '%crianca%' THEN 'Babá'
              WHEN c.tipos_cuidado LIKE '%pet%' THEN 'Pet Walker'
              ELSE 'Cuidador'
            END
          ELSE 'Cliente'
        END as especialidade,
        c.avaliacao,
        c.valor_hora
      FROM usuario u
      LEFT JOIN cuidador c ON c.usuario_id = u.id
      WHERE u.nome LIKE ?
    `;

    const params = [`%${termo}%`];

    if (tipo_usuario) {
      query += ` AND u.tipo = ?`;
      params.push(tipo_usuario);
    }

    query += ` ORDER BY u.nome ASC LIMIT 20`;

    const [rows] = await db.query(query, params);
    return rows;
  }

  /**
   * Deletar mensagem
   */
  static async delete(id, usuario_id) {
    const [result] = await db.query(
      `DELETE FROM mensagem WHERE id = ? AND remetente_id = ?`,
      [id, usuario_id]
    );
    return result.affectedRows;
  }
}

module.exports = MensagemModel;
