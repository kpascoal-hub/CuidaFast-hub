const db = require('./db');

class ClienteModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM cliente');
    return rows;
  }

  static async getById(usuario_id) {
    const [rows] = await db.query('SELECT * FROM cliente WHERE usuario_id = ?', [usuario_id]);
    return rows[0];
  }

  static async create(cliente) {
    const { usuario_id, historico_contratacoes, endereco, preferencias } = cliente;
    const [result] = await db.query(
      'INSERT INTO cliente (usuario_id, historico_contratacoes, endereco, preferencias) VALUES (?, ?, ?, ?)',
      [usuario_id, historico_contratacoes, endereco, preferencias]
    );
    return result.insertId;
  }

  static async update(usuario_id, cliente) {
    const { historico_contratacoes, endereco, preferencias } = cliente;
    const [result] = await db.query(
      'UPDATE cliente SET historico_contratacoes = ?, endereco = ?, preferencias = ?, data_modificacao = CURRENT_TIMESTAMP WHERE usuario_id = ?',
      [historico_contratacoes, endereco, preferencias, usuario_id]
    );
    return result.affectedRows;
  }

  static async delete(usuario_id) {
    const [result] = await db.query('DELETE FROM cliente WHERE usuario_id = ?', [usuario_id]);
    return result.affectedRows;
  }
}

module.exports = ClienteModel;

