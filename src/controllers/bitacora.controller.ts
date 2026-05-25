import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import * as BitacoraService from '../services/bitacora.service.js';

export const getLogs = catchAsync(async (_req: Request, res: Response) => {
    const logs = await BitacoraService.getAllLogs();
    res.status(200).json({ success: true, data: logs });
});

export const getLogById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de bitácora suministrado no es válido' });
    }

    const log = await BitacoraService.getLogById(id);
    if (!log) {
        return res.status(404).json({ success: false, message: 'Registro de auditoría no encontrado' });
    }

    res.status(200).json({ success: true, data: log });
});

export const getLogsByAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id_administrador } = req.params;

    if (!id_administrador || typeof id_administrador !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de administrador no es válido para la búsqueda forense' });
    }

    const logs = await BitacoraService.getLogsByAdmin(id_administrador);
    res.status(200).json({ success: true, data: logs });
});

export const createLog = catchAsync(async (req: Request, res: Response) => {
    const { id_bitacora, id_administrador, id_modulo, accion, tabla_afectada, registro_id } = req.body;

    if (!id_bitacora || !id_administrador || !id_modulo || !accion || !tabla_afectada || !registro_id) {
        return res.status(400).json({
            success: false,
            message: 'Faltan parámetros críticos de auditoría para asentar el registro'
        });
    }

    const ip_usuario = req.body.ip_usuario || req.ip || req.socket.remoteAddress || '0.0.0.0';
    const dispositivo = req.body.dispositivo || req.headers['user-agent'] || 'Desconocido';

    const newLog = await BitacoraService.createLog({
        ...req.body,
        ip_usuario,
        dispositivo
    });

    res.status(201).json({ success: true, data: newLog });
});