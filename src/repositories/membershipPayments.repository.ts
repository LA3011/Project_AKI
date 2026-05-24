import { query } from '../config/database.pg.js';
import { type MembershipPayments } from '../interfaces/membershipPayments.interface.js';

const FIELDS = `
  id_pago, id_empresa_membresia, referencia_pago, paypal_transaction_id, 
  payer_email, monto, moneda, estado_pago, metodo_pago, respuesta_paypal, fecha_pago
`;

export const MembershipPaymentsRepository = {
    async findAll(): Promise<MembershipPayments[]> {
        const sql = `SELECT ${FIELDS} FROM public.pagos_membresias ORDER BY fecha_pago DESC`;
        const { rows } = await query(sql);
        return rows;
    },

    async findById(id: string): Promise<MembershipPayments | null> {
        const sql = `SELECT ${FIELDS} FROM public.pagos_membresias WHERE id_pago = $1`;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    },

    async findByCompanyMembership(idEmpresaMembresia: string): Promise<MembershipPayments[]> {
        const sql = `SELECT ${FIELDS} FROM public.pagos_membresias WHERE id_empresa_membresia = $1 ORDER BY fecha_pago DESC`;
        const { rows } = await query(sql, [idEmpresaMembresia]);
        return rows;
    },

    async create(data: Partial<MembershipPayments>): Promise<MembershipPayments> {
        const sql = `
            INSERT INTO public.pagos_membresias (
                id_empresa_membresia, referencia_pago, paypal_transaction_id, 
                payer_email, monto, moneda, estado_pago, metodo_pago, respuesta_paypal, fecha_pago
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING ${FIELDS}
        `;
        const values = [
            data.id_empresa_membresia,
            data.referencia_pago,
            data.paypal_transaction_id,
            data.payer_email,
            data.monto,
            data.moneda,
            data.estado_pago,
            data.metodo_pago,
            data.respuesta_paypal,
            data.fecha_pago ?? new Date()
        ];
        const { rows } = await query(sql, values);
        return rows[0];
    },

    async update(id: string, data: Partial<MembershipPayments>): Promise<MembershipPayments | null> {
        const sql = `
            UPDATE public.pagos_membresias
            SET 
                id_empresa_membresia = COALESCE($1, id_empresa_membresia),
                referencia_pago = COALESCE($2, referencia_pago),
                paypal_transaction_id = COALESCE($3, paypal_transaction_id),
                payer_email = COALESCE($4, payer_email),
                monto = COALESCE($5, monto),
                moneda = COALESCE($6, moneda),
                estado_pago = COALESCE($7, estado_pago),
                metodo_pago = COALESCE($8, metodo_pago),
                respuesta_paypal = COALESCE($9, respuesta_paypal),
                fecha_pago = COALESCE($10, fecha_pago)
            WHERE id_pago = $11
            RETURNING ${FIELDS}
        `;
        const values = [
            data.id_empresa_membresia ?? null,
            data.referencia_pago ?? null,
            data.paypal_transaction_id ?? null,
            data.payer_email ?? null,
            data.monto ?? null,
            data.moneda ?? null,
            data.estado_pago ?? null,
            data.metodo_pago ?? null,
            data.respuesta_paypal ?? null,
            data.fecha_pago ?? null,
            id
        ];
        const { rows } = await query(sql, values);
        return rows[0] || null;
    },

    async delete(id: string): Promise<boolean> {
        const sql = `DELETE FROM public.pagos_membresias WHERE id_pago = $1`;
        const { rowCount } = await query(sql, [id]);
        return (rowCount ?? 0) > 0;
    }
};