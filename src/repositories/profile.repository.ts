import { query } from '../config/database.pg.js';
import { type Profile } from '../interfaces/profile.interface.js';

const PROFILE_FIELDS = 'id_perfil, nombre, descripcion, nivel_acceso, estado';

export const ProfileRepository = {
  async findAll(): Promise<Profile[]> {
    const sql = `SELECT ${PROFILE_FIELDS} FROM public.perfiles ORDER BY nivel_acceso DESC`;
    const { rows } = await query(sql);
    return rows;
  },

  async findById(id: string): Promise<Profile | null> {
    const sql = `SELECT ${PROFILE_FIELDS} FROM public.perfiles WHERE id_perfil = $1`;
    const { rows } = await query(sql, [id]);
    return rows[0] || null;
  },

  async create(data: Partial<Profile>): Promise<Profile> {
    const sql = `
      INSERT INTO public.perfiles (nombre, descripcion, nivel_acceso, estado)
      VALUES ($1, $2, $3, $4)
      RETURNING ${PROFILE_FIELDS}
    `;
    const values = [
      data.nombre,
      data.descripcion,
      data.nivel_acceso,
      data.estado || true
    ];
    const { rows } = await query(sql, values);
    return rows[0];
  },

  async update(id: string, data: Partial<Profile>): Promise<Profile | null> {
    const sql = `
      UPDATE public.perfiles
      SET 
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        nivel_acceso = COALESCE($3, nivel_acceso),
        estado = COALESCE($4, estado)
      WHERE id_perfil = $5
      RETURNING ${PROFILE_FIELDS}
    `;
    const values = [
      data.nombre ?? null,
      data.descripcion ?? null,
      data.nivel_acceso ?? null,
      data.estado ?? null,
      id
    ];
    const { rows } = await query(sql, values);
    return rows[0] || null;
  },

  async deleteLogical(id: string): Promise<Profile | null> {
    const sql = `
      UPDATE public.perfiles
      SET estado = false
      WHERE id_perfil = $1
      RETURNING ${PROFILE_FIELDS}
    `;
    const { rows } = await query(sql, [id]);
    return rows[0] || null;
  }
};