import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Helper (Ejecutar consultas)
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

// Evento (monitorear conexión)
pool.on('connect', () => {
  console.log('[Postgres] Conexión a PostgreSQL establecida correctamente');
});

pool.on('error', (err) => {
  console.error('(Error-DataBase) Inesperado en el Pool de Postgres', err);
  process.exit(-1);
});

export default pool;
