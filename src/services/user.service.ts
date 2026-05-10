import { UserRepository } from '../repositories/user.repository.js';

export const getAllUsers = async () => {
  return await UserRepository.findAll();
};
