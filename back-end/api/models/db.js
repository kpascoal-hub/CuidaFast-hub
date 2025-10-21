const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'cuidafast_user',
  password: process.env.DB_PASS || 'F3c@p2&&25$',
  database: process.env.DB_NAME || 'cuidafast_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
