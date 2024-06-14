const mysql = require('mysql2/promise');
const { URL } = require('url');
require('dotenv').config();

const dbUrl = new URL(process.env.DATABASE_URL);

console.log('Connecting to MySQL with:', {
  host: dbUrl.hostname,
  port: dbUrl.port,
  user: dbUrl.username,
  password: dbUrl.password || '(no password)',
  database: dbUrl.pathname.replace('/', ''),
});

const pool = mysql.createPool({
  host: dbUrl.hostname,
  port: dbUrl.port,
  user: dbUrl.username,
  password: dbUrl.password || '',
  database: dbUrl.pathname.replace('/', ''),
});

module.exports = pool;
