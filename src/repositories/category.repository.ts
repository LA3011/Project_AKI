import { query } from '../config/database.pg.js';
import { type Category } from '../interfaces/category.interface.js';

const CATEGORY_FIELDS = 'id_categoria, nombre, icono, descripcion, estado';

export const CategoryRepository = {
    async findAll(): Promise<Category[]> {
        const sql = `SELECT ${CATEGORY_FIELDS} FROM categorias ORDER BY nombre ASC`;
        const { rows } = await query(sql);
        return rows;
    },

    async findById(id: string): Promise<Category | null> {
        const sql = `SELECT ${CATEGORY_FIELDS} FROM categorias WHERE id_categoria = $1`;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    },

    async create(data: Partial<Category>): Promise<Category> {
        const sql = `
            INSERT INTO public.categorias (nombre, icono, descripcion, estado)
            VALUES ($1, $2, $3, $4)
            RETURNING ${CATEGORY_FIELDS}
        `;
        const values = [data.nombre, data.icono, data.descripcion, data.estado || true];
        const { rows } = await query(sql, values);
        return rows[0];
    },

    async update(id: string, data: Partial<Category>): Promise<Category | null> {
        const sql = `
            UPDATE public.categorias
            SET 
                nombre = COALESCE($1, nombre),
                icono = COALESCE($2, icono),
                descripcion = COALESCE($3, descripcion),
                estado = COALESCE($4, estado),
            WHERE id_categoria = $5
            RETURNING ${CATEGORY_FIELDS}
        `;
        
        const values = [
            data.nombre ?? null,
            data.icono ?? null,
            data.descripcion ?? null,
            data.estado ?? null,
            id
        ];
        
        const { rows } = await query(sql, values);
        return rows[0] || null;
    },

    async deleteLogical(id: string): Promise<Category | null> {
        const sql = `
            UPDATE public.categorias
            SET estado = false
            WHERE id_categoria = $1
            RETURNING ${CATEGORY_FIELDS}
        `;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    }
};