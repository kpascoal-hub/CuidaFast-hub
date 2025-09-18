const db = require('./db');

class ContratarModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM contratar');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM contratar WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(contratar) {
    const { cliente_id, cuidador_id, tipo_contratacao, data_inicio, data_fim, status } = contratar;
    const [result] = await db.query(
      'INSERT INTO contratar (cliente_id, cuidador_id, tipo_contratacao, data_inicio, data_fim, status) VALUES (?, ?, ?, ?, ?, ?)',
      [cliente_id, cuidador_id, tipo_contratacao, data_inicio, data_fim, status]
    );
    return result.insertId;
  }

  static async update(id, contratar) {
    const { tipo_contratacao, data_inicio, data_fim, status } = contratar;
    const [result] = await db.query(
      'UPDATE contratar SET tipo_contratacao = ?, data_inicio = ?, data_fim = ?, status = ?, data_modificacao = CURRENT_TIMESTAMP WHERE id = ?',
      [tipo_contratacao, data_inicio, data_fim, status, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM contratar WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = ContratarModel;

