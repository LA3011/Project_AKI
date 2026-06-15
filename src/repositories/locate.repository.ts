import { query } from '../config/database.pg.js';
import type { StateFilters, CityFilters, MunicipalityFilters, StateResult, CityResult, MunicipalityResult } from '../interfaces/locate.interface.ts';

export const LocateRepository = {
  async findStates(filters: StateFilters): Promise<StateResult[]> {
    let sql = `
      SELECT 
        id_estado AS id, 
        nombre AS name, 
        codigo AS code, 
        estado AS status,
        COALESCE((
          SELECT json_agg(json_build_object(
            'id', m.id_municipio,
            'name', m.nombre,
            'status', m.estado,
            'cities', COALESCE((
              SELECT json_agg(json_build_object(
                'id', c.id_ciudad,
                'name', c.nombre,
                'status', c.estado
              )) FROM public.ciudades c WHERE c.id_municipio = m.id_municipio
            ), '[]'::json)
          )) FROM public.municipios m WHERE m.id_estado = public.estados.id_estado
        ), '[]'::json) AS municipalities
      FROM public.estados 
      WHERE 1=1
    `;
    const values: (string | number)[] = [];

    if (filters.id) {
      values.push(filters.id);
      sql += ` AND id_estado = $${values.length}`;
    }

    if (filters.name) {
      values.push(`%${filters.name}%`);
      sql += ` AND nombre ILIKE $${values.length}`;
    }

    const sortMap: Record<string, string> = { id: 'id_estado', name: 'nombre', code: 'codigo' };
    const sort = sortMap[filters.sort || ''] || 'nombre';
    const order = filters.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    sql += ` ORDER BY ${sort} ${order}`;

    const { rows } = await query(sql, values);
    return rows as StateResult[];
  },

  async findCities(filters: CityFilters): Promise<CityResult[]> {
    let sql = `
      SELECT 
        c.id_ciudad AS id, 
        c.nombre AS name, 
        c.estado AS status,
        json_build_object(
          'id', m.id_municipio,
          'name', m.nombre,
          'status', m.estado
        ) AS municipality,
        json_build_object(
          'id', e.id_estado,
          'name', e.nombre,
          'status', e.estado
        ) AS state
      FROM public.ciudades c
      INNER JOIN public.municipios m ON c.id_municipio = m.id_municipio
      INNER JOIN public.estados e ON m.id_estado = e.id_estado
      WHERE 1=1
    `;
    const values: (string | number)[] = [];

    if (filters.id) {
      values.push(filters.id);
      sql += ` AND c.id_ciudad = $${values.length}`;
    }

    if (filters.name) {
      values.push(`%${filters.name}%`);
      sql += ` AND c.nombre ILIKE $${values.length}`;
    }

    if (filters.stateId) {
      values.push(filters.stateId);
      sql += ` AND m.id_estado = $${values.length}`;
    }

    if (filters.stateName) {
      values.push(`%${filters.stateName}%`);
      sql += ` AND e.nombre ILIKE $${values.length}`;
    }

    const sortMap: Record<string, string> = { id: 'c.id_ciudad', name: 'c.nombre' };
    const sort = sortMap[filters.sort || ''] || 'c.nombre';
    const order = filters.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    sql += ` ORDER BY ${sort} ${order}`;

    const { rows } = await query(sql, values);
    return rows as CityResult[];
  },

  async findMunicipalities(filters: MunicipalityFilters): Promise<MunicipalityResult[]> {
    let sql = `
      SELECT 
        m.id_municipio AS id, 
        m.nombre AS name, 
        m.estado AS status,
        json_build_object(
          'id', e.id_estado,
          'name', e.nombre,
          'status', e.estado
        ) AS state,
        COALESCE((
          SELECT json_agg(json_build_object(
            'id', c.id_ciudad,
            'name', c.nombre,
            'status', c.estado
          )) FROM public.ciudades c WHERE c.id_municipio = m.id_municipio
        ), '[]'::json) AS cities
      FROM public.municipios m
      INNER JOIN public.estados e ON m.id_estado = e.id_estado
      WHERE 1=1
    `;
    const values: (string | number)[] = [];

    if (filters.id) {
      values.push(filters.id);
      sql += ` AND m.id_municipio = $${values.length}`;
    }

    if (filters.name) {
      values.push(`%${filters.name}%`);
      sql += ` AND m.nombre ILIKE $${values.length}`;
    }

    if (filters.cityId) {
      values.push(filters.cityId);
      sql += ` AND EXISTS (
        SELECT 1 FROM public.ciudades c_filter 
        WHERE c_filter.id_municipio = m.id_municipio 
          AND c_filter.id_ciudad = $${values.length}
      )`;
    }

    if (filters.cityName) {
      values.push(`%${filters.cityName}%`);
      sql += ` AND EXISTS (
        SELECT 1 FROM public.ciudades c_filter 
        WHERE c_filter.id_municipio = m.id_municipio 
          AND c_filter.nombre ILIKE $${values.length}
      )`;
    }

    const sortMap: Record<string, string> = { id: 'm.id_municipio', name: 'm.nombre' };
    const sort = sortMap[filters.sort || ''] || 'm.nombre';
    const order = filters.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    sql += ` ORDER BY ${sort} ${order}`;

    const { rows } = await query(sql, values);
    return rows as MunicipalityResult[];
  }
};