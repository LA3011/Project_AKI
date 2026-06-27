import type { CreateEventDTO, UpdateEventDTO, EventFilters, EventWithDetails } from '../interfaces/events.interface.js';
import { EventRepository } from '../repositories/event.repository.js';
import { R2Service } from './r2.service.js';

export class EventService {
    
    static async createEvent(data: CreateEventDTO, idUsuario: number): Promise<EventWithDetails> {
        const newEvent = await EventRepository.create(data, idUsuario);
        
        const eventWithDetails = await EventRepository.findById(newEvent.id_evento);
        if (!eventWithDetails) {
            throw new Error('Error al obtener el evento creado');
        }
        
        if (eventWithDetails.imagen_principal) {
            eventWithDetails.imagen_principal_url = await R2Service.getSignedUrl(eventWithDetails.imagen_principal, 3600);
        }
        
        return eventWithDetails;
    }
    
    static async getEvents(filters: EventFilters): Promise<EventWithDetails[]> {
        const events = await EventRepository.findAll(filters);
        
        for (const event of events) {
            if (event.imagen_principal) {
                event.imagen_principal_url = await R2Service.getSignedUrl(event.imagen_principal, 3600);
            }
        }
        
        return events;
    }
    
    static async getEventById(id: number): Promise<EventWithDetails | null> {
        const event = await EventRepository.findById(id);
        
        if (event && event.imagen_principal) {
            event.imagen_principal_url = await R2Service.getSignedUrl(event.imagen_principal, 3600);
        }
        
        return event;
    }
    
    static async updateEvent(id: number, data: UpdateEventDTO, idUsuario: number): Promise<EventWithDetails | null> {
        const existingEvent = await EventRepository.findById(id);
        if (!existingEvent) {
            throw new Error('Evento no encontrado');
        }
        
        if (existingEvent.id_usuario !== idUsuario) {
            throw new Error('No tienes permiso para modificar este evento');
        }
        
        if (data.imagen_principal && existingEvent.imagen_principal) {
            await R2Service.deleteImage(existingEvent.imagen_principal);
        }
        
        const updatedEvent = await EventRepository.update(id, data);
        if (!updatedEvent) {
            throw new Error('Error al actualizar el evento');
        }
        
        const eventWithDetails = await EventRepository.findById(id);
        if (!eventWithDetails) {
            throw new Error('Error al obtener el evento actualizado');
        }
        
        if (eventWithDetails.imagen_principal) {
            eventWithDetails.imagen_principal_url = await R2Service.getSignedUrl(eventWithDetails.imagen_principal, 3600);
        }
        
        return eventWithDetails;
    }
    
    static async toggleEventEstado(id: number, estado: boolean, idUsuario: number): Promise<EventWithDetails | null> {
        const existingEvent = await EventRepository.findById(id);
        if (!existingEvent) {
            throw new Error('Evento no encontrado');
        }
        
        if (existingEvent.id_usuario !== idUsuario) {
            throw new Error('No tienes permiso para modificar este evento');
        }
        
        await EventRepository.toggleEstado(id, estado);
        
        const eventWithDetails = await EventRepository.findById(id);
        if (!eventWithDetails) {
            throw new Error('Error al obtener el evento actualizado');
        }
        
        if (eventWithDetails.imagen_principal) {
            eventWithDetails.imagen_principal_url = await R2Service.getSignedUrl(eventWithDetails.imagen_principal, 3600);
        }
        
        return eventWithDetails;
    }
    
    static async deleteEvent(id: number): Promise<EventWithDetails | null> {
        const existingEvent = await EventRepository.findById(id);
        if (!existingEvent) {
            throw new Error('Evento no encontrado');
        }
        
        if (existingEvent.imagen_principal) {
            await R2Service.deleteImage(existingEvent.imagen_principal);
        }
        
        const deletedEvent = await EventRepository.delete(id);
        if (!deletedEvent) {
            throw new Error('Error al eliminar el evento');
        }
        
        return existingEvent;
    }
    
    static async getEventsByUser(idUsuario: number, filters: EventFilters): Promise<EventWithDetails[]> {
        const events = await EventRepository.findByUser(idUsuario, filters);
        
        for (const event of events) {
            if (event.imagen_principal) {
                event.imagen_principal_url = await R2Service.getSignedUrl(event.imagen_principal, 3600);
            }
        }
        
        return events;
    }
}