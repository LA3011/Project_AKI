import pool, { query } from '../config/database.pg.js';
import { type User } from '../interfaces/user.interface.js';

export const UserRepository = {
  async findAll(): Promise<User[]> {
    const sql = 'SELECT * FROM users ORDER BY id_user ASC';
    const { rows } = await query(sql);
    return rows;
  },

  async findById(id: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE id_user = $1';
    const { rows } = await query(sql, [id]);
    return rows[0] || null;
  },

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT id_user, email, password, role FROM users WHERE email = $1';
    const values = [email];

    try {
      const res = await pool.query(query, values);

      if (res.rows.length === 0)
        return null;

      return res.rows[0] as User;

    } catch (err: any) {
      console.error('[Server] User-Repository: Error en findByEmail:', err.message);
      throw new Error('Error al consultar el usuario en la base de datos');
    }
  },

  async create(data: User): Promise<User> {
    const sql = `
    INSERT INTO public.users (name, "lastName", email, password, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id_user, email, role
  `;

    const values = [
      data.name,
      data.lastName,
      data.email,
      data.password,
      data.role
    ];

    const { rows } = await query(sql, values);
    return rows[0];
  }

};
