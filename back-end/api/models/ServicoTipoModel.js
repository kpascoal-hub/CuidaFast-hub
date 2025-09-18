const db = require('./db');

class ServicoTipoModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM servico_tipo');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM servico_tipo WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(servico) {
    const { nome, descricao } = servico;
    const [result] = await db.query(
      'INSERT INTO servico_tipo (nome, descricao) VALUES (?, ?)',
      [nome, descricao]
    );
    return result.insertId;
  }

  static async update(id, servico) {
    const { nome, descricao } = servico;
    const [result] = await db.query(
      'UPDATE servico_tipo SET nome = ?, descricao = ? WHERE id = ?',
      [nome, descricao, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM servico_tipo WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = ServicoTipoModel;

