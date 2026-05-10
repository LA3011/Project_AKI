import { query } from '../config/database.pg.js';
import { type User } from '../interfaces/user.interface.js';

export const UserRepository = {
  async findAll(): Promise<User[]> {
    const sql = 'SELECT * FROM users ORDER BY id ASC';
    const { rows } = await query(sql);
    return rows;
  },

  async findById(id: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await query(sql, [id]);
    return rows[0] || null;
  }
  
};
