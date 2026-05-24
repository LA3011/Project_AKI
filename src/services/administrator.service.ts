import { type Administrator } from '../interfaces/administrator.interface.js';
import { AdministratorRepository } from '../repositories/administrator.repository.js';

export const getAllAdministrators = async () => {
  return await AdministratorRepository.findAll();
};

export const getAdministratorById = async (id: string) => {
  return await AdministratorRepository.findById(id);
};

export const createAdministrator = async (data: Partial<Administrator>) => {
  return await AdministratorRepository.create(data);
};

export const updateAdministrator = async (id: string, data: Partial<Administrator>) => {
  return await AdministratorRepository.update(id, data);
};

export const deleteAdministrator = async (id: string) => {
  return await AdministratorRepository.deleteLogical(id);
};