export interface PostImage {
    id_post: number;
    key: string; // KEY en R2
    url?: string; // URL firmada (opcional)
    titulo?: string;
    descripcion?: string;
    fecha_publicacion?: Date;
}

export interface CompanyListResponse {
    id_empresa: number;
    id_usuario: number;
    id_categoria: number | null;
    id_estado: number;
    id_municipio: number;
    id_ciudad: number;
    nombre_comercial: string;
    razon_social: string | null;
    rif: string | null;
    pagina_web: string | null;
    logo: string | null; // KEY en R2
    logo_url: string | null; // URL firmada 
    descripcion: string | null;
    estado: boolean | null;
    fecha_registro: Date;
}

export interface CompanyDetailResponse {
    id_empresa: number;
    id_usuario: number;
    id_categoria: number | null;
    id_estado: number;
    id_municipio: number;
    id_ciudad: number;
    nombre_comercial: string;
    razon_social: string | null;
    rif: string | null;
    pagina_web: string | null;
    logo: string | null; // KEY en R2
    descripcion: string | null;
    estado: boolean | null;
    fecha_registro: Date;
    post: PostImage[]; // Posts con sus imágenes y URLs firmadas
}

export interface Company {
    id_empresa: number;
    id_usuario: number;
    id_categoria: number | null;
    id_estado: number;
    id_municipio: number;
    id_ciudad: number;
    nombre_comercial: string;
    razon_social: string | null;
    rif: string | null;
    pagina_web: string | null;
    logo: string | null; // KEY en R2
    logo_url?: string | null; // URL firmada (para getCompanies)
    descripcion: string | null;
    estado: boolean | null;
    fecha_registro: Date;
    post?: PostImage[]; // Solo para getCompanyById
}