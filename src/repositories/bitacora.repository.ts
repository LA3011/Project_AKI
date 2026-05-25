import { query } from '../config/database.pg.js';
import { type Bitacora } from '../interfaces/bitacora.interface.js';

const FIELDS = 'id_bitacora, id_administrador, id_modulo, accion, tabla_afectada, registro_id, ip_usuario, dispositivo, fecha';

export const BitacoraRepository = {
    async findAll(): Promise<Bitacora[]> {
        const sql = `SELECT ${FIELDS} FROM public.bitacora ORDER BY fecha DESC`;
        const { rows } = await query(sql);
        return rows;
    },

    async findById(id: string): Promise<Bitacora | null> {
        const sql = `SELECT ${FIELDS} FROM public.bitacora WHERE id_bitacora = $1`;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    },

    async findByAdministrator(idAdministrador: string): Promise<Bitacora[]> {
        const sql = `SELECT ${FIELDS} FROM public.bitacora WHERE id_administrador = $1 ORDER BY fecha DESC`;
        const { rows } = await query(sql, [idAdministrador]);
        return rows;
    },

    async create(data: Partial<Bitacora>): Promise<Bitacora> {
        const sql = `
            INSERT INTO public.bitacora (
                id_bitacora, id_administrador, id_modulo, accion, 
                tabla_afectada, registro_id, ip_usuario, dispositivo, fecha
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING ${FIELDS}
        `;
        const values = [
            data.id_bitacora,
            data.id_administrador,
            data.id_modulo,
            data.accion,
            data.tabla_afectada,
            data.registro_id,
            data.ip_usuario,
            data.dispositivo,
            data.fecha ?? new Date()
        ];
        const { rows } = await query(sql, values);
        return rows[0];
    }

};