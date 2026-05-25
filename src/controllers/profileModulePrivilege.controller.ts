import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import * as PrivilegeService from '../services/profileModulePrivilege.service.js';

export const getRelations = catchAsync(async (_req: Request, res: Response) => {
    const relations = await PrivilegeService.getAllRelations();
    res.status(200).json({ success: true, data: relations });
});

export const getRelationById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de la asignación no es válido o no fue proporcionado' });
    }

    const relation = await PrivilegeService.getRelationById(id);
    if (!relation) {
        return res.status(404).json({ success: false, message: 'Asignación de privilegio no encontrada' });
    }

    res.status(200).json({ success: true, data: relation });
});

export const getRelationsByProfile = catchAsync(async (req: Request, res: Response) => {
    const { id_perfil } = req.params;

    if (!id_perfil || typeof id_perfil !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de perfil suministrado no es válido' });
    }

    const relations = await PrivilegeService.getRelationsByProfile(id_perfil);
    res.status(200).json({ success: true, data: relations });
});

export const createRelation = catchAsync(async (req: Request, res: Response) => {
    const { id_perfil, id_modulo, id_privilegio } = req.body;

    if (!id_perfil || !id_modulo || !id_privilegio) {
        return res.status(400).json({
            success: false,
            message: 'Faltan parámetros obligatorios para definir el acceso (id_perfil, id_modulo, id_privilegio)'
        });
    }

    const newRelation = await PrivilegeService.createRelation(req.body);
    res.status(201).json({ success: true, data: newRelation });
});

export const updateRelation = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de asignación especificado en la ruta es incorrecto' });
    }

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ success: false, message: 'Cuerpo de petición vacío. Debe indicar al menos un componente de la matriz a actualizar' });
    }

    const updatedRelation = await PrivilegeService.updateRelation(id, req.body);
    if (!updatedRelation) {
        return res.status(404).json({ success: false, message: 'No se encontró la relación solicitada para actualizar' });
    }

    res.status(200).json({ success: true, data: updatedRelation });
});

export const deleteRelation = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID enviado no cumple con los requisitos mínimos de eliminación' });
    }

    const isDeleted = await PrivilegeService.deleteRelation(id);
    if (!isDeleted) {
        return res.status(404).json({ success: false, message: 'La asignación de privilegio especificada no existe en el sistema' });
    }

    res.status(200).json({ success: true });
});