import { query } from '../config/database.pg.js';
import { type CompanyBranch } from '../interfaces/companyBranch.interface.js';

const BRANCH_FIELDS = `
  id_sucursal, id_empresa, id_estado, id_municipio, id_ciudad, 
  nombre_sucursal, direccion, telefono, correo, foto_principal, 
  descripcion, estado, fecha_creacion
`;

export const CompanyBranchRepository = {
    async findAll(): Promise<CompanyBranch[]> {
        const sql = `SELECT ${BRANCH_FIELDS} FROM public.sucursales ORDER BY fecha_creacion DESC`;
        const { rows } = await query(sql);
        return rows;
    },

    async findById(id: string): Promise<CompanyBranch | null> {
        const sql = `SELECT ${BRANCH_FIELDS} FROM public.sucursales WHERE id_sucursal = $1`;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    },

    async findByCompany(idEmpresa: string): Promise<CompanyBranch[]> {
        const sql = `SELECT ${BRANCH_FIELDS} FROM public.sucursales WHERE id_empresa = $1 AND estado = true`;
        const { rows } = await query(sql, [idEmpresa]);
        return rows;
    },

    async create(data: Partial<CompanyBranch>): Promise<CompanyBranch> {
        const sql = `
            INSERT INTO public.sucursales (
                id_empresa, id_estado, id_municipio, id_ciudad, 
                nombre_sucursal, direccion, telefono, correo, foto_principal, descripcion, estado
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING ${BRANCH_FIELDS}
        `;
        const values = [
            data.id_empresa,
            data.id_estado,
            data.id_municipio,
            data.id_ciudad,
            data.nombre_sucursal,
            data.direccion,
            data.telefono,
            data.correo,
            data.foto_principal ?? 'none-foto',
            data.descripcion,
            data.estado ?? true
        ];
        const { rows } = await query(sql, values);
        return rows[0];
    },

    async update(id: string, data: Partial<CompanyBranch>): Promise<CompanyBranch | null> {
        const sql = `
            UPDATE public.sucursales
            SET 
                id_estado = COALESCE($1, id_estado),
                id_municipio = COALESCE($2, id_municipio),
                id_ciudad = COALESCE($3, id_ciudad),
                nombre_sucursal = COALESCE($4, nombre_sucursal),
                direccion = COALESCE($5, direccion),
                telefono = COALESCE($6, telefono),
                correo = COALESCE($7, correo),
                foto_principal = COALESCE($8, foto_principal),
                descripcion = COALESCE($9, descripcion)
            WHERE id_sucursal = $10
            RETURNING ${BRANCH_FIELDS}
        `;
        const values = [
            data.id_estado ?? null,
            data.id_municipio ?? null,
            data.id_ciudad ?? null,
            data.nombre_sucursal ?? null,
            data.direccion ?? null,
            data.telefono ?? null,
            data.correo ?? null,
            data.foto_principal ?? null,
            data.descripcion ?? null,
            id
        ];
        const { rows } = await query(sql, values);
        return rows[0] || null;
    },

    async deleteLogical(id: string): Promise<CompanyBranch | null> {
        const sql = `
            UPDATE public.sucursales
            SET estado = false
            WHERE id_sucursal = $1
            RETURNING ${BRANCH_FIELDS}
        `;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    }
};