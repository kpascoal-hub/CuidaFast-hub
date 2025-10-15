const db = require('./db');

class TokenModel {
  static async create(userId, token) {
    const [result] = await db.query(
      'INSERT INTO tokens (user_id, token) VALUES (?, ?)',
      [userId, token]
    );
    return result.insertId;
  }

  static async findByToken(token) {
    const [rows] = await db.query('SELECT * FROM tokens WHERE token = ?', [token]);
    return rows[0];
  }

  static async deleteByToken(token) {
    const [result] = await db.query('DELETE FROM tokens WHERE token = ?', [token]);
    return result.affectedRows;
  }

  static async deleteAllForUser(userId) {
    const [result] = await db.query('DELETE FROM tokens WHERE user_id = ?', [userId]);
    return result.affectedRows;
  }
}

module.exports = TokenModel;

