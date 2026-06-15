import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import * as LocateService from '../services/locate.service.js';
import type { StateFilters, CityFilters, MunicipalityFilters } from '../interfaces/locate.interface.js';

export const getStates = catchAsync(async (req: Request, res: Response) => {
  const filters: StateFilters = {
    id: req.query.id as string | undefined,
    name: req.query.name as string | undefined,
    sort: req.query.sort as string | undefined,
    order: req.query.order as 'ASC' | 'DESC' | 'asc' | 'desc' | undefined
  };

  const result = await LocateService.getStates(filters);
  res.status(200).json(result);
});

export const getCities = catchAsync(async (req: Request, res: Response) => {
  const filters: CityFilters = {
    id: req.query.id as string | undefined,
    name: req.query.name as string | undefined,
    stateId: req.query.stateId as string | undefined,
    stateName: req.query.stateName as string | undefined,
    sort: req.query.sort as string | undefined,
    order: req.query.order as 'ASC' | 'DESC' | 'asc' | 'desc' | undefined
  };

  const result = await LocateService.getCities(filters);
  res.status(200).json(result);
});

export const getMunicipalities = catchAsync(async (req: Request, res: Response) => {
  const filters: MunicipalityFilters = {
    id: req.query.id as string | undefined,
    name: req.query.name as string | undefined,
    cityId: req.query.cityId as string | undefined,
    cityName: req.query.cityName as string | undefined,
    sort: req.query.sort as string | undefined,
    order: req.query.order as 'ASC' | 'DESC' | 'asc' | 'desc' | undefined
  };

  const result = await LocateService.getMunicipalities(filters);
  res.status(200).json(result);
});