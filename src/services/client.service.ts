import { type Client } from '../interfaces/client.interface.js';
import { ClientRepository } from '../repositories/client.repository.js';

export const getAllClients = async () => {
  return await ClientRepository.findAll();
};

export const getClientById = async (id: string) => {
  return await ClientRepository.findById(id);
};

export const getClientByIdUsuario = async (idUsuario: string) => {
  return await ClientRepository.findByIdUsuario(idUsuario);
};

export const createClient = async (data: Partial<Client>) => {
  return await ClientRepository.create(data);
};

export const updateClient = async (id: string, data: Partial<Client>) => {
  return await ClientRepository.update(id, data);
};

export const deleteClient = async (id: string) => {
  return await ClientRepository.deleteLogical(id);
};