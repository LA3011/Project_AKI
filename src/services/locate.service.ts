import type { StateFilters, CityFilters, MunicipalityFilters, StateResult, CityResult, MunicipalityResult } from '../interfaces/locate.interface.js';
import { LocateRepository } from '../repositories/locate.repository.js';

export const getStates = async (filters: StateFilters): Promise<StateResult[]> => {
  return await LocateRepository.findStates(filters);
};

export const getCities = async (filters: CityFilters): Promise<CityResult[]> => {
  return await LocateRepository.findCities(filters);
};

export const getMunicipalities = async (filters: MunicipalityFilters): Promise<MunicipalityResult[]> => {
  return await LocateRepository.findMunicipalities(filters);
};