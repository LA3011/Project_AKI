import { query } from '../config/database.pg.js';
import { type Company } from '../interfaces/company.interface.js';

const COMPANY_FIELDS = `
  id_empresa, id_usuario, id_categoria, id_estado, id_municipio, 
  id_ciudad, nombre_comercial, razon_social, rif, pagina_web, logo, descripcion, 
  estado, fecha_registro
`;

export const CompanyRepository = {
    async findAll(): Promise<Company[]> {
        const sql = `SELECT ${COMPANY_FIELDS} FROM public.empresas ORDER BY fecha_registro DESC`;
        const { rows } = await query(sql);
        return rows;
    },

    async findById(id: string): Promise<Company | null> {
        const sql = `SELECT ${COMPANY_FIELDS} FROM public.empresas WHERE id_empresa = $1`;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    },

    async create(data: Partial<Company>): Promise<Company> {
        const sql = `
            INSERT INTO public.empresas (
                id_usuario, id_categoria, id_estado, 
                id_municipio, id_ciudad, nombre_comercial, razon_social, rif, 
                pagina_web, logo, descripcion, estado
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING ${COMPANY_FIELDS}
        `;
        const values = [
            data.id_usuario,
            data.id_categoria,
            data.id_estado,
            data.id_municipio,
            data.id_ciudad,
            data.nombre_comercial,
            data.razon_social,
            data.rif,
            data.pagina_web,
            data.logo,
            data.descripcion,
            data.estado || true
        ];
        const { rows } = await query(sql, values);
        return rows[0];
    },

    async update(id: string, data: Partial<Company>): Promise<Company | null> {
        const sql = `
            UPDATE public.empresas
            SET 
                id_categoria = COALESCE($1, id_categoria),
                id_estado = COALESCE($2, id_estado),
                id_municipio = COALESCE($3, id_municipio),
                id_ciudad = COALESCE($4, id_ciudad),
                nombre_comercial = COALESCE($5, nombre_comercial),
                razon_social = COALESCE($6, razon_social),
                rif = COALESCE($7, rif),
                pagina_web = COALESCE($8, pagina_web),
                logo = COALESCE($9, logo),
                descripcion = COALESCE($10, descripcion)
            WHERE id_empresa = $11
            RETURNING ${COMPANY_FIELDS}
        `;
        const values = [
            data.id_categoria ?? null,
            data.id_estado ?? null,
            data.id_municipio ?? null,
            data.id_ciudad ?? null,
            data.nombre_comercial ?? null,
            data.razon_social ?? null,
            data.rif ?? null,
            data.pagina_web ?? null,
            data.logo ?? null,
            data.descripcion ?? null,
            id
        ];
        const { rows } = await query(sql, values);
        return rows[0] || null;
    },

    async deleteLogical(id: string): Promise<Company | null> {
        const sql = `
            UPDATE public.empresas
            SET estado = false
            WHERE id_empresa = $1
            RETURNING ${COMPANY_FIELDS}
        `;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    }
};