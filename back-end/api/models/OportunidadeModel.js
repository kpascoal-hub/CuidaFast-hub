const db = require('./db');

class OportunidadeModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM oportunidade');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM oportunidade WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(oportunidade) {
    const { cliente_id, cuidador_id, origem, status, valor_estimado, contratacao_id } = oportunidade;
    const [result] = await db.query(
      'INSERT INTO oportunidade (cliente_id, cuidador_id, origem, status, valor_estimado, contratacao_id) VALUES (?, ?, ?, ?, ?, ?)',
      [cliente_id, cuidador_id, origem, status, valor_estimado, contratacao_id]
    );
    return result.insertId;
  }

  static async update(id, oportunidade) {
    const { origem, status, valor_estimado, contratacao_id } = oportunidade;
    const [result] = await db.query(
      'UPDATE oportunidade SET origem = ?, status = ?, valor_estimado = ?, contratacao_id = ? , data_criacao = CURRENT_TIMESTAMP WHERE id = ?',
      [origem, status, valor_estimado, contratacao_id, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM oportunidade WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = OportunidadeModel;

