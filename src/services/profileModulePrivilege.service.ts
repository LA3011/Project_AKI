import { type ProfileModulePrivilege } from '../interfaces/profileModulePrivilege.interface.js';
import { ProfileModulePrivilegeRepository } from '../repositories/profileModulePrivilege.repository.js';

export const getAllRelations = async () => {
  return await ProfileModulePrivilegeRepository.findAll();
};

export const getRelationById = async (id: string) => {
  return await ProfileModulePrivilegeRepository.findById(id);
};

export const getRelationsByProfile = async (idPerfil: string) => {
  return await ProfileModulePrivilegeRepository.findByProfile(idPerfil);
};

export const createRelation = async (data: Partial<ProfileModulePrivilege>) => {
  return await ProfileModulePrivilegeRepository.create(data);
};

export const updateRelation = async (id: string, data: Partial<ProfileModulePrivilege>) => {
  return await ProfileModulePrivilegeRepository.update(id, data);
};

export const deleteRelation = async (id: string) => {
  return await ProfileModulePrivilegeRepository.delete(id);
};