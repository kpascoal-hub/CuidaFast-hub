const db = require('./db');

class MensagemModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM mensagem');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM mensagem WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(mensagem) {
    const { remetente_id, destinatario_id, conteudo } = mensagem;
    const [result] = await db.query(
      'INSERT INTO mensagem (remetente_id, destinatario_id, conteudo) VALUES (?, ?, ?)',
      [remetente_id, destinatario_id, conteudo]
    );
    return result.insertId;
  }

  static async update(id, mensagem) {
    const { conteudo } = mensagem;
    const [result] = await db.query(
      'UPDATE mensagem SET conteudo = ?, data_modificacao = CURRENT_TIMESTAMP WHERE id = ?',
      [conteudo, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM mensagem WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = MensagemModel;

