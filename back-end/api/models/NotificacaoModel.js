const db = require('./db');

class NotificacaoModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM notificacao');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM notificacao WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(notificacao) {
    const { usuario_id, titulo, mensagem, status_leitura } = notificacao;
    const [result] = await db.query(
      'INSERT INTO notificacao (usuario_id, titulo, mensagem, status_leitura) VALUES (?, ?, ?, ?)',
      [usuario_id, titulo, mensagem, status_leitura]
    );
    return result.insertId;
  }

  static async update(id, notificacao) {
    const { titulo, mensagem, status_leitura } = notificacao;
    const [result] = await db.query(
      'UPDATE notificacao SET titulo = ?, mensagem = ?, status_leitura = ?, data_modificacao = CURRENT_TIMESTAMP WHERE id = ?',
      [titulo, mensagem, status_leitura, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM notificacao WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = NotificacaoModel;

