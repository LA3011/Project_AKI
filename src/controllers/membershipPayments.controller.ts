import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import * as PaymentService from '../services/membershipPayments.service.js';

export const getPayments = catchAsync(async (_req: Request, res: Response) => {
    const payments = await PaymentService.getAllPayments();
    res.status(200).json({ success: true, data: payments });
});

export const getPaymentById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de registro de pago no es válido o está ausente' });
    }

    const payment = await PaymentService.getPaymentById(id);
    if (!payment) {
        return res.status(404).json({ success: false, message: 'Registro de pago no encontrado' });
    }

    res.status(200).json({ success: true, data: payment });
});

export const getPaymentsByMembership = catchAsync(async (req: Request, res: Response) => {
    const { id_empresa_membresia } = req.params;

    if (!id_empresa_membresia || typeof id_empresa_membresia !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de relación de membresía empresarial suministrado es inválido' });
    }

    const payments = await PaymentService.getPaymentsByMembership(id_empresa_membresia);
    res.status(200).json({ success: true, data: payments });
});

export const createPayment = catchAsync(async (req: Request, res: Response) => {
    const { id_empresa_membresia, monto, moneda, estado_pago, metodo_pago, referencia_pago } = req.body;

    if (!id_empresa_membresia || !monto || !moneda || !estado_pago || !metodo_pago || !referencia_pago) {
        return res.status(400).json({
            success: false,
            message: 'Faltan parámetros obligatorios de auditoría fiscal (id_empresa_membresia, monto, moneda, estado_pago, metodo_pago, referencia_pago)'
        });
    }

    if (isNaN(Number(monto)) || Number(monto) <= 0) {
        return res.status(400).json({ success: false, message: 'El monto de la transacción debe ser un valor numérico superior a cero' });
    }

    const newPayment = await PaymentService.createPayment(req.body);
    res.status(201).json({ success: true, data: newPayment });
});

export const updatePayment = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de pago especificado en la ruta no es válido' });
    }

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ success: false, message: 'Cuerpo de petición vacío. Debe proporcionar los atributos financieros a modificar' });
    }

    const updatedPayment = await PaymentService.updatePayment(id, req.body);
    if (!updatedPayment) {
        return res.status(404).json({ success: false, message: 'Registro transaccional no encontrado para actualizar' });
    }

    res.status(200).json({ success: true, data: updatedPayment });
});

export const deletePayment = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID enviado no cumple con las condiciones requeridas de borrado' });
    }

    const isDeleted = await PaymentService.deletePayment(id);
    if (!isDeleted) {
        return res.status(404).json({ success: false, message: 'El registro de pago no existe en la base de datos' });
    }

    res.status(200).json({ success: true });
});