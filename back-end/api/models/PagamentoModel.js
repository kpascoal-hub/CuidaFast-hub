const db = require('./db');

class PagamentoModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM pagamento');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM pagamento WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(pagamento) {
    const { consulta_id, contratar_id, cliente_id, cuidador_id, data_pagamento, valor, metodo_pagamento, status, referencia } = pagamento;
    const [result] = await db.query(
      'INSERT INTO pagamento (consulta_id, contratar_id, cliente_id, cuidador_id, data_pagamento, valor, metodo_pagamento, status, referencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [consulta_id, contratar_id, cliente_id, cuidador_id, data_pagamento, valor, metodo_pagamento, status, referencia]
    );
    return result.insertId;
  }

  static async update(id, pagamento) {
    const { data_pagamento, valor, metodo_pagamento, status, referencia } = pagamento;
    const [result] = await db.query(
      'UPDATE pagamento SET data_pagamento = ?, valor = ?, metodo_pagamento = ?, status = ?, referencia = ?, criado_em = CURRENT_TIMESTAMP WHERE id = ?',
      [data_pagamento, valor, metodo_pagamento, status, referencia, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM pagamento WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = PagamentoModel;

