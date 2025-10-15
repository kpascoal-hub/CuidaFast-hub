const db = require('./db');

class CuidadorModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM cuidador');
    return rows;
  }

  static async getById(usuario_id) {
    const [rows] = await db.query('SELECT * FROM cuidador WHERE usuario_id = ?', [usuario_id]);
    return rows[0];
  }

  static async create(cuidador) {
    const { usuario_id, tipos_cuidado, descricao, valor_hora, especialidades, experiencia, avaliacao, horarios_disponiveis, idiomas, formacao, local_trabalho, ganhos } = cuidador;
    const [result] = await db.query(
      'INSERT INTO cuidador (usuario_id, tipos_cuidado, descricao, valor_hora, especialidades, experiencia, avaliacao, horarios_disponiveis, idiomas, formacao, local_trabalho, ganhos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [usuario_id, tipos_cuidado, descricao, valor_hora, especialidades, experiencia, avaliacao, horarios_disponiveis, idiomas, formacao, local_trabalho, ganhos]
    );
    return result.insertId;
  }

  static async update(usuario_id, cuidador) {
    const { tipos_cuidado, descricao, valor_hora, especialidades, experiencia, avaliacao, horarios_disponiveis, idiomas, formacao, local_trabalho, ganhos } = cuidador;
    const [result] = await db.query(
      `UPDATE cuidador SET tipos_cuidado = ?, descricao = ?, valor_hora = ?, especialidades = ?, experiencia = ?, avaliacao = ?, horarios_disponiveis = ?, idiomas = ?, formacao = ?, local_trabalho = ?, ganhos = ? WHERE usuario_id = ?`,
      [tipos_cuidado, descricao, valor_hora, especialidades, experiencia, avaliacao, horarios_disponiveis, idiomas, formacao, local_trabalho, ganhos, usuario_id]
    );
    return result.affectedRows;
  }

  static async delete(usuario_id) {
    const [result] = await db.query('DELETE FROM cuidador WHERE usuario_id = ?', [usuario_id]);
    return result.affectedRows;
  }
}

module.exports = CuidadorModel;

