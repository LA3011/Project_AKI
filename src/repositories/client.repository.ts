import { query } from '../config/database.pg.js';
import { type Client } from '../interfaces/client.interface.js';

const CLIENT_FIELDS = 'id_cliente, id_usuario, cedula, fecha_nacimiento, sexo, estado';

export const ClientRepository = {
  async findAll(): Promise<Client[]> {
    const sql = `SELECT ${CLIENT_FIELDS} FROM clientes ORDER BY id_cliente ASC`;
    const { rows } = await query(sql);
    return rows;
  },

  async findById(id: string): Promise<Client | null> {
    const sql = `SELECT ${CLIENT_FIELDS} FROM clientes WHERE id_cliente = $1`;
    const { rows } = await query(sql, [id]);
    return rows[0] || null;
  },

  async findByIdUsuario(idUsuario: string): Promise<Client | null> {
    const sql = `SELECT ${CLIENT_FIELDS} FROM clientes WHERE id_usuario = $1`;
    const { rows } = await query(sql, [idUsuario]);
    return rows[0] || null;
  },

  async create(data: Partial<Client>): Promise<Client> {
    const sql = `
      INSERT INTO public.clientes (id_usuario, cedula, fecha_nacimiento, sexo)
      VALUES ($1, $2, $3, $4)
      RETURNING ${CLIENT_FIELDS}
    `;
    const values = [
      data.id_usuario,
      data.cedula,
      data.fecha_nacimiento,
      data.sexo
    ];
    const { rows } = await query(sql, values);
    return rows[0];
  },

  async update(id: string, data: Partial<Client>): Promise<Client | null> {
    const sql = `
      UPDATE public.clientes
      SET 
        cedula = COALESCE($1, cedula),
        fecha_nacimiento = COALESCE($2, fecha_nacimiento),
        sexo = COALESCE($3, sexo),
        estado = COALESCE($4, estado)
      WHERE id_cliente = $5
      RETURNING ${CLIENT_FIELDS}
    `;
    const values = [
      data.cedula ?? null,
      data.fecha_nacimiento ?? null,
      data.sexo ?? null,
      data.estado ?? null,
      id
    ];
    const { rows } = await query(sql, values);
    return rows[0] || null;
  },

  async deleteLogical(id: string): Promise<Client | null> {
    const sql = `
      UPDATE public.clientes
      SET estado = false
      WHERE id_cliente = $1
      RETURNING ${CLIENT_FIELDS}
    `;
    const { rows } = await query(sql, [id]);
    return rows[0] || null;
  }
};