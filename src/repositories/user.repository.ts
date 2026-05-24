import { query } from '../config/database.pg.js';
import { type User } from '../interfaces/user.interface.js';

const USER_FIELDS = `
  id_usuario, tipo_usuario, id_estado, id_municipio, id_ciudad, 
  nombres, apellidos, correo, password_hash, telefono, 
  foto_perfil, ultimo_login, verificado, estado, fecha_registro
`;

export const UserRepository = {
  async findAll(): Promise<User[]> {
    const sql = `SELECT ${USER_FIELDS} FROM usuarios ORDER BY id_usuario ASC`;
    const { rows } = await query(sql);
    return rows;
  },

  async findById(id: string): Promise<User | null> {
    const sql = `SELECT ${USER_FIELDS} FROM usuarios WHERE id_usuario = $1`;
    const { rows } = await query(sql, [id]);
    return rows[0] || null;
  },

  async findByEmail(email: string): Promise<User | null> {
    const sql = `SELECT ${USER_FIELDS} FROM usuarios WHERE correo = $1`;
    try {
      const { rows } = await query(sql, [email]);
      if (rows.length === 0) return null;
      return rows[0] as User;
    } catch (err: any) {
      console.error('[Server] User-Repository: Error en findByEmail:', err.message);
      throw new Error('Error al consultar el usuario en la base de datos');
    }
  },

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const sql = `
      UPDATE public.usuarios
      SET 
        tipo_usuario = COALESCE($1, tipo_usuario),
        id_estado = COALESCE($2, id_estado),
        id_municipio = COALESCE($3, id_municipio),
        id_ciudad = COALESCE($4, id_ciudad),
        nombres = COALESCE($5, nombres),
        apellidos = COALESCE($6, apellidos),
        telefono = COALESCE($7, telefono),
        foto_perfil = COALESCE($8, foto_perfil)
      WHERE id_usuario = $9
      RETURNING id_usuario, tipo_usuario, id_estado, id_municipio, id_ciudad, 
                nombres, apellidos, correo, telefono, foto_perfil, 
                ultimo_login, verificado, estado, fecha_registro
    `;

    const values = [
      data.tipo_usuario ?? null,
      data.id_estado ?? null,
      data.id_municipio ?? null,
      data.id_ciudad ?? null,
      data.nombres ?? null,
      data.apellidos ?? null,
      data.telefono ?? null,
      data.foto_perfil ?? null,
      id
    ];

    const { rows } = await query(sql, values);
    return rows[0] || null;
  },

  async create(data: Partial<User>): Promise<User> {
    const sql = `
      INSERT INTO public.usuarios (
        tipo_usuario, id_estado, id_municipio, id_ciudad, 
        nombres, apellidos, correo, password_hash, telefono, foto_perfil
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING ${USER_FIELDS}
    `;

    const values = [
      data.tipo_usuario,
      data.id_estado,
      data.id_municipio,
      data.id_ciudad,
      data.nombres,
      data.apellidos,
      data.correo,
      data.password_hash,
      data.telefono,
      data.foto_perfil
    ];

    const { rows } = await query(sql, values);
    return rows[0];
  },

  async deleteLogical(id: string): Promise<User | null> {
    const sql = `
      UPDATE public.usuarios 
      SET estado = false 
      WHERE id_usuario = $1 
      RETURNING ${USER_FIELDS}
    `;
    const { rows } = await query(sql, [id]);
    return rows[0] || null;
  }
}; 