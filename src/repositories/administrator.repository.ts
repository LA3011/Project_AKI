import { query } from '../config/database.pg.js';
import { type Administrator } from '../interfaces/administrator.interface.js';

const ADMIN_FIELDS = 'id_administrador, id_usuario, id_perfil, estado';

export const AdministratorRepository = {
    async findAll(): Promise<Administrator[]> {
        const sql = `SELECT ${ADMIN_FIELDS} FROM public.administradores ORDER BY id_administrador ASC`;
        const { rows } = await query(sql);
        return rows;
    },

    async findById(id: string): Promise<Administrator | null> {
        const sql = `SELECT ${ADMIN_FIELDS} FROM public.administradores WHERE id_administrador = $1`;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    },

    async create(data: Partial<Administrator>): Promise<Administrator> {
        const sql = `
            INSERT INTO public.administradores (id_usuario, id_perfil, estado)
            VALUES ($1, $2, $3)
            RETURNING ${ADMIN_FIELDS}
        `;
        const values = [
            data.id_usuario,
            data.id_perfil,
            data.estado ?? true
        ];
        const { rows } = await query(sql, values);
        return rows[0];
    },

    async update(id: string, data: Partial<Administrator>): Promise<Administrator | null> {
        const sql = `
            UPDATE public.administradores
            SET 
                id_perfil = COALESCE($1, id_perfil),
                estado = COALESCE($2, estado)
            WHERE id_administrador = $3
            RETURNING ${ADMIN_FIELDS}
        `;
        const values = [
            data.id_perfil ?? null,
            data.estado ?? null,
            id
        ];
        const { rows } = await query(sql, values);
        return rows[0] || null;
    },

    async deleteLogical(id: string): Promise<Administrator | null> {
        const sql = `
            UPDATE public.administradores
            SET estado = false
            WHERE id_administrador = $1
            RETURNING ${ADMIN_FIELDS}
        `;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    }
};