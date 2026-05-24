import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import * as ClientService from '../services/client.service.js';

export const getClients = catchAsync(async (_req: Request, res: Response) => {
  const clients = await ClientService.getAllClients();
  res.status(200).json({ success: true, data: clients });
});

export const getClientById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'El ID proporcionado no es válido' }); 
  }

  const client = await ClientService.getClientById(id);
  if (!client) {
    return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
  }

  res.status(200).json({ success: true, data: client });
});

export const createClient = catchAsync(async (req: Request, res: Response) => {
  const newClient = await ClientService.createClient(req.body);
  res.status(201).json({ success: true, data: newClient });
});

export const updateClient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'El ID proporcionado no es válido' });
  }

  const updatedClient = await ClientService.updateClient(id, req.body);
  if (!updatedClient) {
    return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
  }

  res.status(200).json({ success: true, data: updatedClient });
});

export const deleteClient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'El ID proporcionado no es válido' });
  }

  const deletedClient = await ClientService.deleteClient(id);
  if (!deletedClient) {
    return res.status(404).json({ success: false, message: 'Cliente no encontrado o ya inactivo' });
  }

  res.status(200).json({ 
    success: true, 
    data: deletedClient 
  });
});