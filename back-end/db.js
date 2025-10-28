// ~/www/back-end/db.js
const { Pool } = require('pg');
require('dotenv').config({ path: __dirname + '/config/.env' });

// Configuração para Supabase PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
