export interface BaseLocateFilters {
    id?: string | number | undefined;
    name?: string | undefined;
    sort?: string | undefined;
    order?: 'ASC' | 'DESC' | 'asc' | 'desc' | undefined;
}

export interface StateFilters extends BaseLocateFilters { }

export interface CityFilters extends BaseLocateFilters {
    stateId?: string | number | undefined;
    stateName?: string | undefined;
}

export interface MunicipalityFilters extends BaseLocateFilters {
    cityId?: string | number | undefined;
    cityName?: string | undefined;
}

export interface StateResult {
    id: number;
    name: string;
    code: string;
    status: boolean;
    municipalities: {
        id: number;
        name: string;
        status: boolean;
        cities: {
            id: number;
            name: string;
            status: boolean;
        }[];
    }[];
}

export interface CityResult {
    id: number;
    name: string;
    status: boolean;
    municipality: {
        id: number;
        name: string;
        status: boolean;
    };
    state: {
        id: number;
        name: string;
        status: boolean;
    };
}

export interface MunicipalityResult {
    id: number;
    name: string;
    status: boolean;
    state: {
        id: number;
        name: string;
        status: boolean;
    };
    cities: {
        id: number;
        name: string;
        status: boolean;
    }[];
}