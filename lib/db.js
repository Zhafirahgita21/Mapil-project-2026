import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const caCertPath = path.join(process.cwd(), 'ca (2).pem');

let sslConfig = { rejectUnauthorized: false };
if (fs.existsSync(caCertPath)) {
  sslConfig = { ca: fs.readFileSync(caCertPath) };
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

let tableReady = null;

// Membuat tabel otomatis kalau belum ada (hanya dijalankan sekali)
export function ensureTable() {
  if (!tableReady) {
    tableReady = pool
      .query(`
        CREATE TABLE IF NOT EXISTS wishlist (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nama_wishlist VARCHAR(100) NOT NULL,
          deskripsi TEXT,
          harga DECIMAL(12, 2) DEFAULT 0,
          status ENUM('belum tercapai', 'tercapai') DEFAULT 'belum tercapai',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      .catch((err) => {
        tableReady = null;
        throw err;
      });
  }
  return tableReady;
}

export function getPool() {
  return pool;
}

export default pool;