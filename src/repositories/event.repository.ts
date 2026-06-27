import { query } from '../config/database.pg.js';
import type { Event, CreateEventDTO, UpdateEventDTO, EventFilters, EventWithDetails } from '../interfaces/events.interface.js';

export class EventRepository {
    
    static async create(data: CreateEventDTO, idUsuario: number): Promise<Event> {
        const sql = `
            INSERT INTO public.eventos (
                id_usuario, id_estado, id_municipio, id_ciudad, id_categoria,
                titulo, descripcion, direccion, telefono, correo,
                fecha_inicio, fecha_finalizacion, hora_inicio, hora_finalizacion,
                imagen_principal
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *
        `;
        
        const values = [
            idUsuario,
            data.id_estado,
            data.id_municipio,
            data.id_ciudad,
            data.id_categoria,
            data.titulo,
            data.descripcion,
            data.direccion,
            data.telefono,
            data.correo,
            data.fecha_inicio,
            data.fecha_finalizacion,
            data.hora_inicio,
            data.hora_finalizacion,
            data.imagen_principal || null
        ];
        
        const { rows } = await query(sql, values);
        return rows[0];
    }
    
    static async findAll(filters: EventFilters): Promise<EventWithDetails[]> {
        let sql = `
            SELECT e.*, 
                   u.nombres as creador_nombre, 
                   u.apellidos as creador_apellidos,
                   u.foto_perfil as creador_foto,
                   est.nombre,
                   mun.nombre,
                   ciu.nombre,
                   cat.nombre
            FROM public.eventos e
            LEFT JOIN public.usuarios u ON e.id_usuario = u.id_usuario
            LEFT JOIN public.estados est ON e.id_estado = est.id_estado
            LEFT JOIN public.municipios mun ON e.id_municipio = mun.id_municipio
            LEFT JOIN public.ciudades ciu ON e.id_ciudad = ciu.id_ciudad
            LEFT JOIN public.categorias cat ON e.id_categoria = cat.id_categoria
            WHERE 1=1
        `;
        
        const values: (string | number | boolean | Date)[] = [];
        let paramCount = 1;
        
        if (filters.id_estado) {
            sql += ` AND e.id_estado = $${paramCount}`;
            values.push(filters.id_estado);
            paramCount++;
        }
        
        if (filters.id_municipio) {
            sql += ` AND e.id_municipio = $${paramCount}`;
            values.push(filters.id_municipio);
            paramCount++;
        }
        
        if (filters.id_ciudad) {
            sql += ` AND e.id_ciudad = $${paramCount}`;
            values.push(filters.id_ciudad);
            paramCount++;
        }
        
        if (filters.id_categoria) {
            sql += ` AND e.id_categoria = $${paramCount}`;
            values.push(filters.id_categoria);
            paramCount++;
        }
        
        if (filters.estado !== undefined) {
            sql += ` AND e.estado = $${paramCount}`;
            values.push(filters.estado);
            paramCount++;
        } else {
            sql += ` AND e.estado = true`;
        }
        
        if (filters.fecha_desde) {
            sql += ` AND e.fecha_inicio >= $${paramCount}`;
            values.push(filters.fecha_desde);
            paramCount++;
        }
        
        if (filters.fecha_hasta) {
            sql += ` AND e.fecha_finalizacion <= $${paramCount}`;
            values.push(filters.fecha_hasta);
            paramCount++;
        }
        
        sql += ` ORDER BY e.fecha_inicio ASC`;
        
        if (filters.limit) {
            sql += ` LIMIT $${paramCount}`;
            values.push(filters.limit);
            paramCount++;
        }
        
        if (filters.offset) {
            sql += ` OFFSET $${paramCount}`;
            values.push(filters.offset);
            paramCount++;
        }
        
        const { rows } = await query(sql, values);
        return rows;
    }
    
    static async findById(id: number): Promise<EventWithDetails | null> {
        const sql = `
            SELECT e.*, 
                   u.nombres as creador_nombre, 
                   u.apellidos as creador_apellidos,
                   u.foto_perfil as creador_foto,
                   est.nombre,
                   mun.nombre,
                   ciu.nombre,
                   cat.nombre
            FROM public.eventos e
            LEFT JOIN public.usuarios u ON e.id_usuario = u.id_usuario
            LEFT JOIN public.estados est ON e.id_estado = est.id_estado
            LEFT JOIN public.municipios mun ON e.id_municipio = mun.id_municipio
            LEFT JOIN public.ciudades ciu ON e.id_ciudad = ciu.id_ciudad
            LEFT JOIN public.categorias cat ON e.id_categoria = cat.id_categoria
            WHERE e.id_evento = $1
        `;
        
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    }
    
    static async update(id: number, data: UpdateEventDTO): Promise<Event | null> {
        const fields: string[] = [];
        const values: (string | number | boolean | Date | null)[] = [];
        let paramCount = 1;
        
        const allowedFields: (keyof UpdateEventDTO)[] = [
            'titulo', 'descripcion', 'id_estado', 'id_municipio', 'id_ciudad',
            'id_categoria', 'direccion', 'telefono', 'correo',
            'fecha_inicio', 'fecha_finalizacion', 'hora_inicio', 'hora_finalizacion',
            'estado', 'imagen_principal'
        ];
        
        for (const key of allowedFields) {
            const value = data[key];
            if (value !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(value as string | number | boolean | Date | null);
                paramCount++;
            }
        }
        
        if (fields.length === 0) return null;
        
        fields.push(`actualizado_en = CURRENT_TIMESTAMP`);
        
        const sql = `
            UPDATE public.eventos
            SET ${fields.join(', ')}
            WHERE id_evento = $${paramCount}
            RETURNING *
        `;
        values.push(id);
        
        const { rows } = await query(sql, values);
        return rows[0] || null;
    }
    
    static async toggleEstado(id: number, estado: boolean): Promise<Event | null> {
        const sql = `
            UPDATE public.eventos
            SET estado = $1, actualizado_en = CURRENT_TIMESTAMP
            WHERE id_evento = $2
            RETURNING *
        `;
        const { rows } = await query(sql, [estado, id]);
        return rows[0] || null;
    }
    
    static async delete(id: number): Promise<Event | null> {
        const sql = `DELETE FROM public.eventos WHERE id_evento = $1 RETURNING *`;
        const { rows } = await query(sql, [id]);
        return rows[0] || null;
    }
    
    static async findByUser(idUsuario: number, filters: EventFilters): Promise<EventWithDetails[]> {
        let sql = `
            SELECT e.*, 
                   u.nombres as creador_nombre, 
                   u.apellidos as creador_apellidos,
                   u.foto_perfil as creador_foto,
                   est.nombre,
                   mun.nombre,
                   ciu.nombre,
                   cat.nombre
            FROM public.eventos e
            LEFT JOIN public.usuarios u ON e.id_usuario = u.id_usuario
            LEFT JOIN public.estados est ON e.id_estado = est.id_estado
            LEFT JOIN public.municipios mun ON e.id_municipio = mun.id_municipio
            LEFT JOIN public.ciudades ciu ON e.id_ciudad = ciu.id_ciudad
            LEFT JOIN public.categorias cat ON e.id_categoria = cat.id_categoria
            WHERE e.id_usuario = $1
        `;
        
        const values: (string | number | boolean | Date)[] = [idUsuario];
        let paramCount = 2;
        
        if (filters.estado !== undefined) {
            sql += ` AND e.estado = $${paramCount}`;
            values.push(filters.estado);
            paramCount++;
        }
        
        if (filters.fecha_desde) {
            sql += ` AND e.fecha_inicio >= $${paramCount}`;
            values.push(filters.fecha_desde);
            paramCount++;
        }
        
        if (filters.fecha_hasta) {
            sql += ` AND e.fecha_finalizacion <= $${paramCount}`;
            values.push(filters.fecha_hasta);
            paramCount++;
        }
        
        sql += ` ORDER BY e.fecha_inicio DESC`;
        
        if (filters.limit) {
            sql += ` LIMIT $${paramCount}`;
            values.push(filters.limit);
            paramCount++;
        }
        
        if (filters.offset) {
            sql += ` OFFSET $${paramCount}`;
            values.push(filters.offset);
            paramCount++;
        }
        
        const { rows } = await query(sql, values);
        return rows;
    }
}