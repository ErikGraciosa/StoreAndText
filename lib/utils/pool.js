const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: 'require' && { rejectUnauthorized: false }
});

pool.on('connect', () => console.log('Postgres connected'));

module.exports = pool;
