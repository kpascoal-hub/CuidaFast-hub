const db = require('./db');

class ConsultaModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM consulta');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM consulta WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(consulta) {
    const { contratar_id, cuidador_id, cliente_id, servico_tipo_id, descricao, data_inicio, data_fim, duracao_min, valor_total, status } = consulta;
    const [result] = await db.query(
      'INSERT INTO consulta (contratar_id, cuidador_id, cliente_id, servico_tipo_id, descricao, data_inicio, data_fim, duracao_min, valor_total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [contratar_id, cuidador_id, cliente_id, servico_tipo_id, descricao, data_inicio, data_fim, duracao_min, valor_total, status]
    );
    return result.insertId;
  }

  static async update(id, consulta) {
    const { descricao, data_inicio, data_fim, duracao_min, valor_total, status } = consulta;
    const [result] = await db.query(
      'UPDATE consulta SET descricao = ?, data_inicio = ?, data_fim = ?, duracao_min = ?, valor_total = ?, status = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?',
      [descricao, data_inicio, data_fim, duracao_min, valor_total, status, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM consulta WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = ConsultaModel;

