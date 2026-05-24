import { type MembershipPayments } from '../interfaces/membershipPayments.interface.js';
import { MembershipPaymentsRepository } from '../repositories/membershipPayments.repository.js';

export const getAllPayments = async () => {
  return await MembershipPaymentsRepository.findAll();
};

export const getPaymentById = async (id: string) => {
  return await MembershipPaymentsRepository.findById(id);
};

export const getPaymentsByMembership = async (idEmpresaMembresia: string) => {
  return await MembershipPaymentsRepository.findByCompanyMembership(idEmpresaMembresia);
};

export const createPayment = async (data: Partial<MembershipPayments>) => {
  return await MembershipPaymentsRepository.create(data);
};

export const updatePayment = async (id: string, data: Partial<MembershipPayments>) => {
  return await MembershipPaymentsRepository.update(id, data);
};

export const deletePayment = async (id: string) => {
  return await MembershipPaymentsRepository.delete(id);
};