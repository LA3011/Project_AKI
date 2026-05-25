export interface Bitacora {
    id_bitacora: string;
    id_administrador: string;
    id_modulo: string;
    accion: string;
    tabla_afectada: string;
    registro_id: string;
    ip_usuario: string;
    dispositivo: string;
    fecha: Date;
}