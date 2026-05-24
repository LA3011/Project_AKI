export interface CompanyBranch {
    id_sucursal: string;
    id_empresa: string;
    id_estado: string;
    id_municipio: string;
    id_ciudad: string;
    nombre_sucursal: string;
    direccion: string;
    telefono: string;
    correo: string;
    foto_principal: string;
    descripcion: string;
    estado: boolean;
    fecha_creacion: Date;
}