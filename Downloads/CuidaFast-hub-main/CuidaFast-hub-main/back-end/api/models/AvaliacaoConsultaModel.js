const db = require('./db');

class AvaliacaoConsultaModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM avaliacao_consulta');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM avaliacao_consulta WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(avaliacao) {
    const { consulta_id, cliente_id, cuidador_id, nota, comentario } = avaliacao;
    const [result] = await db.query(
      'INSERT INTO avaliacao_consulta (consulta_id, cliente_id, cuidador_id, nota, comentario) VALUES (?, ?, ?, ?, ?)',
      [consulta_id, cliente_id, cuidador_id, nota, comentario]
    );
    return result.insertId;
  }

  static async update(id, avaliacao) {
    const { nota, comentario } = avaliacao;
    const [result] = await db.query(
      'UPDATE avaliacao_consulta SET nota = ?, comentario = ?, criado_em = CURRENT_TIMESTAMP WHERE id = ?',
      [nota, comentario, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM avaliacao_consulta WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = AvaliacaoConsultaModel;

