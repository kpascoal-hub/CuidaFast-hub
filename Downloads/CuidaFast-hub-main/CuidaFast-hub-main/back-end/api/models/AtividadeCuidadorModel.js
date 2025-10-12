const db = require('./db');

class AtividadeCuidadorModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM atividade_cuidador');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM atividade_cuidador WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(atividade) {
    const { cuidador_id, tipo_atividade, referencia_id } = atividade;
    const [result] = await db.query(
      'INSERT INTO atividade_cuidador (cuidador_id, tipo_atividade, referencia_id) VALUES (?, ?, ?)',
      [cuidador_id, tipo_atividade, referencia_id]
    );
    return result.insertId;
  }

  static async update(id, atividade) {
    const { tipo_atividade, referencia_id } = atividade;
    const [result] = await db.query(
      'UPDATE atividade_cuidador SET tipo_atividade = ?, referencia_id = ?, criado_em = CURRENT_TIMESTAMP WHERE id = ?',
      [tipo_atividade, referencia_id, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM atividade_cuidador WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = AtividadeCuidadorModel;

