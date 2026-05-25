import { query } from '../config/database.pg.js';
import { type ProfileModulePrivilege } from '../interfaces/profileModulePrivilege.interface.js';

const FIELDS = 'id_perfil_modulo_privilegio, id_perfil, id_modulo, id_privilegio';

export const ProfileModulePrivilegeRepository = {
    async findAll(): Promise<ProfileModulePrivilege[]> {
        const sql = `SELECT ${FIELDS} FROM public.perfil_modulo_privilegio`;
        const { rows } = await query(sql);
        return rows;
    },

    async findById(id: string): Promise<ProfileModulePrivilege | null> {
        const sql = `SELECT ${FIELDS} FROM public.perfil_modulo_privilegio WHERE id_perfil_modulo_privilegio = $1`;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    },

    async findByProfile(idPerfil: string): Promise<ProfileModulePrivilege[]> {
        const sql = `SELECT ${FIELDS} FROM public.perfil_modulo_privilegio WHERE id_perfil = $1`;
        const { rows } = await query(sql, [idPerfil]);
        return rows;
    },

    async create(data: Partial<ProfileModulePrivilege>): Promise<ProfileModulePrivilege> {
        const sql = `
            INSERT INTO public.perfil_modulo_privilegio (id_perfil, id_modulo, id_privilegio)
            VALUES ($1, $2, $3)
            RETURNING ${FIELDS}
        `;
        const values = [
            data.id_perfil,
            data.id_modulo,
            data.id_privilegio
        ];
        const { rows } = await query(sql, values);
        return rows[0];
    },

    async update(id: string, data: Partial<ProfileModulePrivilege>): Promise<ProfileModulePrivilege | null> {
        const sql = `
            UPDATE public.perfil_modulo_privilegio
            SET 
                id_perfil = COALESCE($1, id_perfil),
                id_modulo = COALESCE($2, id_modulo),
                id_privilegio = COALESCE($3, id_privilegio)
            WHERE id_perfil_modulo_privilegio = $4
            RETURNING ${FIELDS}
        `;
        const values = [
            data.id_perfil ?? null,
            data.id_modulo ?? null,
            data.id_privilegio ?? null,
            id
        ];
        const { rows } = await query(sql, values);
        return rows[0] || null;
    },

    async delete(id: string): Promise<boolean> {
        const sql = `DELETE FROM public.perfil_modulo_privilegio WHERE id_perfil_modulo_privilegio = $1`;
        const { rowCount } = await query(sql, [id]);
        return (rowCount ?? 0) > 0;
    }
};