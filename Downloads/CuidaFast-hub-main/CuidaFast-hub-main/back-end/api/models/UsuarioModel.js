const db = require('./db');

class UsuarioModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM usuario');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM usuario WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(usuario) {
    const { nome, email, senha, telefone, data_nascimento, firebase_uid } = usuario;

    // Campos e valores básicos
    const fields = ['nome', 'email', 'senha', 'telefone', 'data_nascimento'];
    const values = [nome, email, senha || null, telefone || null, data_nascimento || null];

    // Só adiciona firebase_uid se existir
    if (firebase_uid) {
      fields.push('firebase_uid');
      values.push(firebase_uid);
    }

    // Gera placeholders de forma dinâmica
    const placeholders = fields.map(() => '?').join(', ');

    // Query final
    const [result] = await db.query(
      `INSERT INTO usuario (${fields.join(', ')}, data_cadastro) VALUES (${placeholders}, NOW())`,
      values
    );

    return result.insertId;
  }

  static async update(id, usuario) {
    const { nome, email, telefone, data_nascimento } = usuario;
    const [result] = await db.query(
      'UPDATE usuario SET nome = ?, email = ?, telefone = ?, data_nascimento = ?, data_modificacao = CURRENT_TIMESTAMP WHERE id = ?',
      [nome, email, telefone, data_nascimento, id]
    );
    return result.affectedRows;
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
    return rows[0];
  }

  static async findByFirebaseUid(uid) {
    const [rows] = await db.query('SELECT * FROM usuario WHERE firebase_uid = ?', [uid]);
    return rows[0];
  }

  static async setLastLogin(id) {
    const [result] = await db.query('UPDATE usuario SET ultimo_login = NOW() WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async updatePassword(id, passwordHash) {
    const [result] = await db.query('UPDATE usuario SET senha = ? WHERE id = ?', [passwordHash, id]);
    return result.affectedRows;
  }

  static async findOrCreateByFirebase(uid, email, nome) {
    let usuario = await this.findByFirebaseUid(uid);
    if (!usuario) {
      const insertId = await this.create({ nome, email, senha: null, telefone: null, data_nascimento: null, firebase_uid: uid });
      usuario = await this.getById(insertId);
    }
    return usuario;
  }
}

module.exports = UsuarioModel;

