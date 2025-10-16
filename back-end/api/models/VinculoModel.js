const db = require('./db');

class VinculoModel {
  static async getCuidadorIdByClienteId(cliente_id) {
    const [rows] = await db.query('SELECT cuidador_id FROM vinculos WHERE cliente_id = ? LIMIT 1', [cliente_id]);
    return rows[0] ? rows[0].cuidador_id : null;
  }

  static async getClienteIdByCuidadorId(cuidador_id) {
    const [rows] = await db.query('SELECT cliente_id FROM vinculos WHERE cuidador_id = ? LIMIT 1', [cuidador_id]);
    return rows[0] ? rows[0].cliente_id : null;
  }

  static async create(cliente_id, cuidador_id) {
    await db.query('INSERT INTO vinculos (cliente_id, cuidador_id) VALUES (?, ?)', [cliente_id, cuidador_id]);
    return true;
  }

  static async delete(cliente_id, cuidador_id) {
    const [res] = await db.query('DELETE FROM vinculos WHERE cliente_id = ? AND cuidador_id = ?', [cliente_id, cuidador_id]);
    return res.affectedRows > 0;
  }
}

module.exports = VinculoModel;
