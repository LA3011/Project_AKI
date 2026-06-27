export interface Event {
    id_evento: number;
    id_usuario: number;
    id_estado: number;
    id_municipio: number;
    id_ciudad: number;
    id_categoria: number;           
    titulo: string;
    descripcion: string;
    direccion: string;
    telefono: string;
    correo: string;
    fecha_inicio: Date;
    fecha_finalizacion: Date;       
    hora_inicio: Date;
    hora_finalizacion: Date;        
    estado: boolean;                 
    imagen_principal: string | null;
    fecha_registro: Date;           
    actualizado_en: Date;
}

export interface CreateEventDTO {
    titulo: string;
    descripcion: string;
    id_estado: number;
    id_municipio: number;
    id_ciudad: number;
    id_categoria: number;           
    direccion: string;
    telefono: string;
    correo: string;
    fecha_inicio: string | Date;
    fecha_finalizacion: string | Date;  
    hora_inicio: string;
    hora_finalizacion: string;          
    imagen_principal?: string | null;
}

export interface UpdateEventDTO extends Partial<CreateEventDTO> {
    estado?: boolean;                
    imagen_principal?: string | null;
}

export interface EventFilters {
    id_estado?: number;
    id_municipio?: number;
    id_ciudad?: number;
    id_categoria?: number;          
    estado?: boolean;               
    fecha_desde?: Date;
    fecha_hasta?: Date;
    limit?: number;
    offset?: number;
}

export interface EventWithDetails extends Event {
    creador_nombre: string;
    creador_apellidos: string;
    creador_foto: string | null;
    nombre_estado: string;
    nombre_municipio: string;
    nombre_ciudad: string;
    nombre_categoria: string;       
    imagen_principal_url?: string | null;
}