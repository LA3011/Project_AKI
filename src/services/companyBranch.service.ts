import { type CompanyBranch } from '../interfaces/companyBranch.interface.js';
import { CompanyBranchRepository } from '../repositories/companyBranch.repository.js';

export const getAllBranches = async () => {
  return await CompanyBranchRepository.findAll();
};

export const getBranchById = async (id: string) => {
  return await CompanyBranchRepository.findById(id);
};

export const getBranchesByCompany = async (idEmpresa: string) => {
  return await CompanyBranchRepository.findByCompany(idEmpresa);
};

export const createBranch = async (data: Partial<CompanyBranch>) => {
  return await CompanyBranchRepository.create(data);
};

export const updateBranch = async (id: string, data: Partial<CompanyBranch>) => {
  return await CompanyBranchRepository.update(id, data);
};

export const deleteBranch = async (id: string) => {
  return await CompanyBranchRepository.deleteLogical(id);
};