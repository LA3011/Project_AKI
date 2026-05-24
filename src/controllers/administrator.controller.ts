import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import * as AdminService from '../services/administrator.service.js';

export const getAdministrators = catchAsync(async (_req: Request, res: Response) => {
  const administrators = await AdminService.getAllAdministrators();
  res.status(200).json({ success: true, data: administrators });
});

export const getAdministratorById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'El ID de administrador no es válido' });
  }

  const admin = await AdminService.getAdministratorById(id);
  if (!admin) {
    return res.status(404).json({ success: false, message: 'Administrador no encontrado' });
  }

  res.status(200).json({ success: true, data: admin });
});

export const createAdministrator = catchAsync(async (req: Request, res: Response) => {

  const { id_usuario, id_perfil } = req.body;

  if (!id_usuario || !id_perfil) {
    return res.status(400).json({
      success: false,
      message: 'Faltan campos obligatorios para emitir a administrador (id_usuario, id_perfil)'
    });
  }

  const newAdmin = await AdminService.createAdministrator(req.body);
  res.status(201).json({ success: true, data: newAdmin });
});

export const updateAdministrator = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'El ID de administrador no es válido' });
  }

  const updatedAdmin = await AdminService.updateAdministrator(id, req.body);
  if (!updatedAdmin) {
    return res.status(404).json({ success: false, message: 'Administrador no encontrado' });
  }

  res.status(200).json({ success: true, data: updatedAdmin });
});

export const deleteAdministrator = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'El ID de administrador no es válido' });
  }

  const deletedAdmin = await AdminService.deleteAdministrator(id);
  if (!deletedAdmin) {
    return res.status(404).json({ success: false, message: 'Administrador no encontrado o ya inactivo' });
  }

  res.status(200).json({
    success: true,
    message: 'Administrador desactivado exitosamente',
    data: deletedAdmin
  });
});