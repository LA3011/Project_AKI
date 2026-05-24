import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import * as BranchService from '../services/companyBranch.service.js';

export const getBranches = catchAsync(async (_req: Request, res: Response) => {
  const branches = await BranchService.getAllBranches();
  res.status(200).json({ success: true, data: branches });
});

export const getBranchById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'El ID de sucursal no es válido' });
  }

  const branch = await BranchService.getBranchById(id);
  if (!branch) {
    return res.status(404).json({ success: false, message: 'Sucursal no encontrada' });
  }

  res.status(200).json({ success: true, data: branch });
});

export const createBranch = catchAsync(async (req: Request, res: Response) => {

  const { nombre_sucursal, direccion, telefono, correo, descripcion } = req.body;

  if (!nombre_sucursal || !direccion || !telefono || !correo || !descripcion) {
    return res.status(400).json({
      success: false,
      message: 'Faltan campos obligatorios para generar la sucursal (nombre_sucursal, direccion, telefono, correo, descripcion)'
    });
  }

  const newBranch = await BranchService.createBranch(req.body);
  res.status(201).json({ success: true, data: newBranch });
});

export const updateBranch = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'El ID de sucursal no es válido' });
  }

  const updatedBranch = await BranchService.updateBranch(id, req.body);
  if (!updatedBranch) {
    return res.status(404).json({ success: false, message: 'Sucursal no encontrada' });
  }

  res.status(200).json({ success: true, data: updatedBranch });
});

export const deleteBranch = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'El ID de sucursal no es válido' });
  }

  const deletedBranch = await BranchService.deleteBranch(id);
  if (!deletedBranch) {
    return res.status(404).json({ success: false, message: 'Sucursal no encontrada o inactiva' });
  }

  res.status(200).json({
    success: true,
    message: 'Sucursal desactivada exitosamente',
    data: deletedBranch
  });
});