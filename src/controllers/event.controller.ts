import type { Request, Response } from 'express';
import type { CreateEventDTO, UpdateEventDTO, EventFilters } from '../interfaces/events.interface.js';
import { catchAsync } from '../utils/catchAsync.js';
import { EventService } from '../services/event.service.js';
import { R2Service } from '../services/r2.service.js';
import { validateImageOrThrow } from '../utils/image.utils.js';

// Crear evento
export const createEvent = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id_usuario;
    const eventData = req.body as CreateEventDTO;

    const requiredFields: (keyof CreateEventDTO)[] = [
        'titulo', 'descripcion', 'id_estado', 'id_municipio', 'id_ciudad',
        'id_categoria', 'direccion', 'telefono', 'correo',
        'fecha_inicio', 'fecha_finalizacion', 'hora_inicio', 'hora_finalizacion'
    ];

    const missingFields = requiredFields.filter(field => !eventData[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Faltan campos obligatorios: ${missingFields.join(', ')}`
        });
    }

    let imagenKey: string | null = null;

    if (req.file) {
        try {
            validateImageOrThrow(req.file);
            const result = await R2Service.uploadImage(
                req.file.buffer,
                req.file.originalname,
                'events',
                { width: 1200, height: 800, quality: 80, format: 'webp' }
            );
            imagenKey = result.key;
        } catch (error) {
            const err = error as Error;
            return res.status(400).json({
                success: false,
                message: 'Error al procesar la imagen del evento',
                error: err.message
            });
        }
    }

    const newEvent = await EventService.createEvent({
        ...eventData,
        imagen_principal: imagenKey
    }, userId);

    res.status(201).json({
        success: true,
        data: newEvent
    });
});

// Obtener eventos
export const getEvents = catchAsync(async (req: Request, res: Response) => {
    const {
        id_estado,
        id_municipio,
        id_ciudad,
        id_categoria,
        estado,
        fecha_desde,
        fecha_hasta,
        limit,
        page
    } = req.query;

    const offset = page ? (parseInt(page as string) - 1) * (parseInt(limit as string) || 10) : 0;
    const limitNum = parseInt(limit as string) || 10;

    const filters: EventFilters = {};

    if (id_estado) {
        filters.id_estado = parseInt(id_estado as string);
    }
    if (id_municipio) {
        filters.id_municipio = parseInt(id_municipio as string);
    }
    if (id_ciudad) {
        filters.id_ciudad = parseInt(id_ciudad as string);
    }
    if (id_categoria) {
        filters.id_categoria = parseInt(id_categoria as string);
    }
    if (estado !== undefined) {
        filters.estado = estado === 'true';
    }
    if (fecha_desde && typeof fecha_desde === 'string') {
        filters.fecha_desde = new Date(fecha_desde);
    }
    if (fecha_hasta && typeof fecha_hasta === 'string') {
        filters.fecha_hasta = new Date(fecha_hasta);
    }

    filters.limit = limitNum;
    filters.offset = offset;

    const events = await EventService.getEvents(filters);

    res.json({
        success: true,
        data: events,
        pagination: {
            page: parseInt(page as string) || 1,
            limit: limitNum,
            total: events.length
        }
    });
});

// Obtener evento por ID
export const getEventById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'El ID del evento no es válido'
        });
    }

    const event = await EventService.getEventById(parseInt(id));

    if (!event) {
        return res.status(404).json({
            success: false,
            message: 'Evento no encontrado'
        });
    }

    res.json({
        success: true,
        data: event
    });
});

// Actualizar evento
export const updateEvent = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'El ID del evento no es válido'
        });
    }

    const userId = (req as any).user.id_usuario;
    const eventData = req.body as UpdateEventDTO;

    let imagenKey: string | null = null;
    let shouldUpdateImage = false;

    if (req.file) {
        try {
            validateImageOrThrow(req.file);
            const result = await R2Service.uploadImage(
                req.file.buffer,
                req.file.originalname,
                'events',
                { width: 1200, height: 800, quality: 80, format: 'webp' }
            );
            imagenKey = result.key;
            shouldUpdateImage = true;
        } catch (error) {
            const err = error as Error;
            return res.status(400).json({
                success: false,
                message: 'Error al procesar la imagen del evento',
                error: err.message
            });
        }
    }

    const updateData: UpdateEventDTO = { ...eventData };
    if (shouldUpdateImage) {
        updateData.imagen_principal = imagenKey;
    }

    const updatedEvent = await EventService.updateEvent(
        parseInt(id),
        updateData,
        userId
    );

    res.json({
        success: true,
        data: updatedEvent
    });
});

// Cambiar status del evento
export const toggleEventEstado = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'El ID del evento no es válido'
        });
    }

    const { estado } = req.body as { estado: boolean };
    const userId = (req as any).user.id_usuario;

    if (estado === undefined || typeof estado !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: 'El campo estado es requerido y debe ser booleano (true/false)'
        });
    }

    const updatedEvent = await EventService.toggleEventEstado(
        parseInt(id),
        estado,
        userId
    );

    res.json({
        success: true,
        message: `Evento ${estado ? 'activado' : 'desactivado'} exitosamente`,
        data: updatedEvent
    });
});

// Eliminar evento (solo admin)
export const deleteEvent = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'El ID del evento no es válido'
        });
    }

    const deletedEvent = await EventService.deleteEvent(parseInt(id));

    res.json({
        success: true,
        message: 'Evento eliminado permanentemente',
        data: deletedEvent
    });
});

// Obtener eventos de un usuario específico
export const getUserEvents = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id_usuario;
    const { status, limit, page } = req.query;

    const offset = page ? (parseInt(page as string) - 1) * (parseInt(limit as string) || 10) : 0;
    const limitNum = parseInt(limit as string) || 10;

    const filters: EventFilters = {};

    if (status !== undefined) {
        filters.estado = status === 'true';
    }

    filters.limit = limitNum;
    filters.offset = offset;

    const events = await EventService.getEventsByUser(userId, filters);

    res.json({
        success: true,
        data: events,
        pagination: {
            page: parseInt(page as string) || 1,
            limit: limitNum,
            total: events.length
        }
    });
});