import { type Bitacora } from '../interfaces/bitacora.interface.js';
import { BitacoraRepository } from '../repositories/bitacora.repository.js';

export const getAllLogs = async () => {
  return await BitacoraRepository.findAll();
};

export const getLogById = async (id: string) => {
  return await BitacoraRepository.findById(id);
};

export const getLogsByAdmin = async (idAdministrador: string) => {
  return await BitacoraRepository.findByAdministrator(idAdministrador);
};

export const createLog = async (data: Partial<Bitacora>) => {
  return await BitacoraRepository.create(data);
};