import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import { upload } from '../middlewares/upload.middleware.js';
import { createEvent, getEvents, getEventById, updateEvent, toggleEventEstado, deleteEvent, getUserEvents } from '../controllers/event.controller.js';

const router = Router();

/**
 * @openapi
 * /api/events:
 *   get:
 *     summary: Obtiene lista de eventos con filtros y paginación
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_estado
 *         schema:
 *           type: integer
 *         description: Filtrar por ID del estado (entidad federativa)
 *         example: 4
 *       - in: query
 *         name: id_municipio
 *         schema:
 *           type: integer
 *         description: Filtrar por ID del municipio
 *         example: 39
 *       - in: query
 *         name: id_ciudad
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de la ciudad
 *         example: 58
 *       - in: query
 *         name: id_categoria
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de la categoría del evento
 *         example: 7
 *       - in: query
 *         name: estado
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado activo (true) o inactivo (false). Por defecto true
 *         example: true
 *       - in: query
 *         name: fecha_desde
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar eventos que inicien desde esta fecha (ISO)
 *         example: "2025-07-01"
 *       - in: query
 *         name: fecha_hasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar eventos que finalicen antes de esta fecha (ISO)
 *         example: "2025-08-31"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de eventos por página
 *         example: 10
 *     responses:
 *       200:
 *         description: "Lista de eventos obtenida exitosamente con paginación"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_evento:
 *                         type: integer
 *                         example: 1
 *                       titulo:
 *                         type: string
 *                         example: "Conferencia de Tecnología 2025"
 *                       descripcion:
 *                         type: string
 *                         example: "Evento sobre inteligencia artificial y machine learning aplicado a negocios"
 *                       id_estado:
 *                         type: integer
 *                         example: 4
 *                       id_municipio:
 *                         type: integer
 *                         example: 39
 *                       id_ciudad:
 *                         type: integer
 *                         example: 58
 *                       id_categoria:
 *                         type: integer
 *                         example: 7
 *                       direccion:
 *                         type: string
 *                         example: "Av. Reforma 123, Col. Centro, CDMX"
 *                       telefono:
 *                         type: string
 *                         example: "0412-0000000"
 *                       correo:
 *                         type: string
 *                         example: "luisrlvarezs@gmail.com"
 *                       fecha_inicio:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-08-01T04:00:00.000Z"
 *                       fecha_finalizacion:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-08-01T04:00:00.000Z"
 *                       hora_inicio:
 *                         type: string
 *                         example: "09:00:00"
 *                       hora_finalizacion:
 *                         type: string
 *                         example: "17:00:00"
 *                       estado:
 *                         type: boolean
 *                         example: true
 *                       fecha_registro:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-28T01:14:35.971Z"
 *                       actualizado_en:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-28T01:14:35.971Z"
 *                       imagen_principal:
 *                         type: string
 *                         example: "events/dbaffe5e-07bc-431a-9804-b8aba29c147d.webp"
 *                       imagen_principal_url:
 *                         type: string
 *                         example: "https://aki.34098949243be3984ed5ccb87a8d8315.r2.cloudflarestorage.com/events/dbaffe5e-07bc-431a-9804-b8aba29c147d.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ac25cf9f04abf4e8f5b343c3f5134091%2F20260627%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260627T212534Z&X-Amz-Expires=3600&X-Amz-Signature=2372d12c43481190318ebbf450b09062b7fe2cb47570cdc1bc2646a2138379c1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
 *                       id_usuario:
 *                         type: integer
 *                         example: 1
 *                       creador_nombre:
 *                         type: string
 *                         example: "Luis"
 *                       creador_apellidos:
 *                         type: string
 *                         example: "Alvarez"
 *                       creador_foto:
 *                         type: string
 *                         example: "profiles/4d6738d9-3f79-4eb4-9710-a09be37317fc.webp"
 *                       nombre:
 *                         type: string
 *                         description: "Nombre de la categoría"
 *                         example: "Tecnología"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 2
 *             example:
 *               success: true
 *               data:
 *                 - id_evento: 1
 *                   titulo: "Conferencia de Tecnología 2025"
 *                   descripcion: "Evento sobre inteligencia artificial y machine learning aplicado a negocios"
 *                   id_estado: 4
 *                   id_municipio: 39
 *                   id_ciudad: 58
 *                   direccion: "Av. Reforma 123, Col. Centro, CDMX"
 *                   telefono: "0412-0000000"
 *                   correo: "luisrlvarezs@gmail.com"
 *                   id_categoria: 7
 *                   fecha_inicio: "2025-08-01T04:00:00.000Z"
 *                   fecha_finalizacion: "2025-08-01T04:00:00.000Z"
 *                   hora_inicio: "09:00:00"
 *                   hora_finalizacion: "17:00:00"
 *                   estado: true
 *                   fecha_registro: "2026-06-28T01:14:35.971Z"
 *                   actualizado_en: "2026-06-28T01:14:35.971Z"
 *                   imagen_principal: "events/dbaffe5e-07bc-431a-9804-b8aba29c147d.webp"
 *                   id_usuario: 1
 *                   creador_nombre: "Luis"
 *                   creador_apellidos: "Alvarez"
 *                   creador_foto: "profiles/4d6738d9-3f79-4eb4-9710-a09be37317fc.webp"
 *                   nombre: "Tecnología"
 *                   imagen_principal_url: "https://aki.34098949243be3984ed5ccb87a8d8315.r2.cloudflarestorage.com/events/dbaffe5e-07bc-431a-9804-b8aba29c147d.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ac25cf9f04abf4e8f5b343c3f5134091%2F20260627%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260627T212534Z&X-Amz-Expires=3600&X-Amz-Signature=2372d12c43481190318ebbf450b09062b7fe2cb47570cdc1bc2646a2138379c1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
 *                 - id_evento: 2
 *                   titulo: "Conferencia de Tecnología 2025"
 *                   descripcion: "Evento sobre inteligencia artificial y machine learning aplicado a negocios"
 *                   id_estado: 4
 *                   id_municipio: 39
 *                   id_ciudad: 58
 *                   direccion: "Av. Reforma 123, Col. Centro, CDMX"
 *                   telefono: "0412-0000000"
 *                   correo: "luisrlvarezs@gmail.com"
 *                   id_categoria: 7
 *                   fecha_inicio: "2025-08-01T04:00:00.000Z"
 *                   fecha_finalizacion: "2025-08-01T04:00:00.000Z"
 *                   hora_inicio: "09:00:00"
 *                   hora_finalizacion: "17:00:00"
 *                   estado: true
 *                   fecha_registro: "2026-06-28T01:15:20.993Z"
 *                   actualizado_en: "2026-06-28T01:15:20.993Z"
 *                   imagen_principal: "events/936224a8-d9a0-48b0-a225-be437f7116ab.webp"
 *                   id_usuario: 1
 *                   creador_nombre: "Luis"
 *                   creador_apellidos: "Alvarez"
 *                   creador_foto: "profiles/4d6738d9-3f79-4eb4-9710-a09be37317fc.webp"
 *                   nombre: "Tecnología"
 *                   imagen_principal_url: "https://aki.34098949243be3984ed5ccb87a8d8315.r2.cloudflarestorage.com/events/936224a8-d9a0-48b0-a225-be437f7116ab.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ac25cf9f04abf4e8f5b343c3f5134091%2F20260627%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260627T212534Z&X-Amz-Expires=3600&X-Amz-Signature=f494083df08052b0b8c1df378210e6064b6d0018cbc62b48e39025469f059a6a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 2
 *       401:
 *         description: No autorizado
 *       400:
 *         description: Parámetros de consulta inválidos
 */
router.get('/', authenticateJWT, getEvents);

/**
 * @openapi
 * /api/events/{id}:
 *   get:
 *     summary: Obtiene la información de un evento específico
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a consultar
 *         example: 5
 *     responses:
 *       200:
 *         description: "Datos del evento obtenidos (success true, data event)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_evento:
 *                       type: integer
 *                       example: 5
 *                     titulo:
 *                       type: string
 *                       example: "Exposición de Arte Contemporáneo"
 *                     descripcion:
 *                       type: string
 *                       example: "Muestra de arte moderno con artistas locales e internacionales"
 *                     imagen_principal:
 *                       type: string
 *                       nullable: true
 *                       example: "events/xyz789.webp"
 *                     imagen_principal_url:
 *                       type: string
 *                       nullable: true
 *                       example: "https://r2.cloudflare.com/events/xyz789.webp?signature=..."
 *                     creador_nombre:
 *                       type: string
 *                       example: "María"
 *                     creador_apellidos:
 *                       type: string
 *                       example: "González"
 *                     nombre_estado:
 *                       type: string
 *                       example: "Nuevo León"
 *                     nombre_municipio:
 *                       type: string
 *                       example: "Monterrey"
 *                     nombre_ciudad:
 *                       type: string
 *                       example: "San Pedro Garza García"
 *                     nombre_categoria:
 *                       type: string
 *                       example: "Arte"
 *                     direccion:
 *                       type: string
 *                       example: "Av. Constitución 789, Col. Valle"
 *                     telefono:
 *                       type: string
 *                       example: "81-2345-6789"
 *                     correo:
 *                       type: string
 *                       example: "info@arte.com"
 *                     fecha_inicio:
 *                       type: string
 *                       format: date
 *                       example: "2025-08-10"
 *                     fecha_finalizacion:
 *                       type: string
 *                       format: date
 *                       example: "2025-08-25"
 *                     hora_inicio:
 *                       type: string
 *                       format: time
 *                       example: "10:00:00"
 *                     hora_finalizacion:
 *                       type: string
 *                       format: time
 *                       example: "20:00:00"
 *                     estado:
 *                       type: boolean
 *                       example: true
 *             example:
 *               success: true
 *               data:
 *                 id_evento: 5
 *                 titulo: "Exposición de Arte Contemporáneo"
 *                 descripcion: "Muestra de arte moderno con artistas locales e internacionales"
 *                 imagen_principal: "events/xyz789.webp"
 *                 imagen_principal_url: "https://r2.cloudflare.com/events/xyz789.webp?signature=..."
 *                 creador_nombre: "María"
 *                 creador_apellidos: "González"
 *                 nombre_estado: "Nuevo León"
 *                 nombre_municipio: "Monterrey"
 *                 nombre_ciudad: "San Pedro Garza García"
 *                 nombre_categoria: "Arte"
 *                 direccion: "Av. Constitución 789, Col. Valle"
 *                 telefono: "81-2345-6789"
 *                 correo: "info@arte.com"
 *                 fecha_inicio: "2025-08-10"
 *                 fecha_finalizacion: "2025-08-25"
 *                 hora_inicio: "10:00:00"
 *                 hora_finalizacion: "20:00:00"
 *                 estado: true
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Evento no encontrado
 *       400:
 *         description: ID inválido
 */
router.get('/:id', authenticateJWT, getEventById);

/**
 * @openapi
 * /api/events:
 *   post:
 *     summary: Crea un nuevo evento en el sistema
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descripcion
 *               - id_estado
 *               - id_municipio
 *               - id_ciudad
 *               - id_categoria
 *               - direccion
 *               - telefono
 *               - correo
 *               - fecha_inicio
 *               - fecha_finalizacion
 *               - hora_inicio
 *               - hora_finalizacion
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Conferencia de Tecnología 2025"
 *               descripcion:
 *                 type: string
 *                 example: "Evento sobre inteligencia artificial y machine learning aplicado a negocios"
 *               id_estado:
 *                 type: integer
 *                 example: 4
 *               id_municipio:
 *                 type: integer
 *                 example: 39
 *               id_ciudad:
 *                 type: integer
 *                 example: 58
 *               id_categoria:
 *                 type: integer
 *                 example: 7
 *               direccion:
 *                 type: string
 *                 example: "Av. Reforma 123, Col. Centro, CDMX"
 *               telefono:
 *                 type: string
 *                 example: "0412-0000000"
 *               correo:
 *                 type: string
 *                 example: "luisrlvarezs@gmail.com"
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-01"
 *               fecha_finalizacion:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-01"
 *               hora_inicio:
 *                 type: string
 *                 format: time
 *                 example: "09:00:00"
 *               hora_finalizacion:
 *                 type: string
 *                 format: time
 *                 example: "17:00:00"
 *               imagen_principal:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del evento (archivo de imagen)
 *           example:
 *             titulo: "Conferencia de Tecnología 2025"
 *             descripcion: "Evento sobre inteligencia artificial y machine learning aplicado a negocios"
 *             id_estado: 4
 *             id_municipio: 39
 *             id_ciudad: 58
 *             id_categoria: 7
 *             direccion: "Av. Reforma 123, Col. Centro, CDMX"
 *             telefono: "0412-0000000"
 *             correo: "luisrlvarezs@gmail.com"
 *             fecha_inicio: "2025-08-01"
 *             fecha_finalizacion: "2025-08-01"
 *             hora_inicio: "09:00:00"
 *             hora_finalizacion: "17:00:00"
 *             imagen_principal: "(archivo binario)"
 *     responses:
 *       201:
 *         description: "Evento creado exitosamente (success: true, data: newEvent)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_evento:
 *                       type: integer
 *                       example: 2
 *                     titulo:
 *                       type: string
 *                       example: "Conferencia de Tecnología 2025"
 *                     descripcion:
 *                       type: string
 *                       example: "Evento sobre inteligencia artificial y machine learning aplicado a negocios"
 *                     id_estado:
 *                       type: integer
 *                       example: 4
 *                     id_municipio:
 *                       type: integer
 *                       example: 39
 *                     id_ciudad:
 *                       type: integer
 *                       example: 58
 *                     id_categoria:
 *                       type: integer
 *                       example: 7
 *                     direccion:
 *                       type: string
 *                       example: "Av. Reforma 123, Col. Centro, CDMX"
 *                     telefono:
 *                       type: string
 *                       example: "0412-0000000"
 *                     correo:
 *                       type: string
 *                       example: "luisrlvarezs@gmail.com"
 *                     fecha_inicio:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-08-01T04:00:00.000Z"
 *                     fecha_finalizacion:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-08-01T04:00:00.000Z"
 *                     hora_inicio:
 *                       type: string
 *                       example: "09:00:00"
 *                     hora_finalizacion:
 *                       type: string
 *                       example: "17:00:00"
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-28T01:15:20.993Z"
 *                     actualizado_en:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-28T01:15:20.993Z"
 *                     imagen_principal:
 *                       type: string
 *                       example: "events/936224a8-d9a0-48b0-a225-be437f7116ab.webp"
 *                     imagen_principal_url:
 *                       type: string
 *                       example: "https://aki.34098949243be3984ed5ccb87a8d8315.r2.cloudflarestorage.com/events/936224a8-d9a0-48b0-a225-be437f7116ab.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ac25cf9f04abf4e8f5b343c3f5134091%2F20260627%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260627T211521Z&X-Amz-Expires=3600&X-Amz-Signature=9c926d4dcc862abab7b4f55cc85280800d6bf1ed971e7b0e2028a34eceb83420&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     creador_nombre:
 *                       type: string
 *                       example: "Luis"
 *                     creador_apellidos:
 *                       type: string
 *                       example: "Alvarez"
 *                     creador_foto:
 *                       type: string
 *                       example: "profiles/4d6738d9-3f79-4eb4-9710-a09be37317fc.webp"
 *                     nombre:
 *                       type: string
 *                       description: "Nombre de la categoría"
 *                       example: "Tecnología"
 *             example:
 *               success: true
 *               data:
 *                 id_evento: 2
 *                 titulo: "Conferencia de Tecnología 2025"
 *                 descripcion: "Evento sobre inteligencia artificial y machine learning aplicado a negocios"
 *                 id_estado: 4
 *                 id_municipio: 39
 *                 id_ciudad: 58
 *                 direccion: "Av. Reforma 123, Col. Centro, CDMX"
 *                 telefono: "0412-0000000"
 *                 correo: "luisrlvarezs@gmail.com"
 *                 id_categoria: 7
 *                 fecha_inicio: "2025-08-01T04:00:00.000Z"
 *                 fecha_finalizacion: "2025-08-01T04:00:00.000Z"
 *                 hora_inicio: "09:00:00"
 *                 hora_finalizacion: "17:00:00"
 *                 estado: true
 *                 fecha_registro: "2026-06-28T01:15:20.993Z"
 *                 actualizado_en: "2026-06-28T01:15:20.993Z"
 *                 imagen_principal: "events/936224a8-d9a0-48b0-a225-be437f7116ab.webp"
 *                 id_usuario: 1
 *                 creador_nombre: "Luis"
 *                 creador_apellidos: "Alvarez"
 *                 creador_foto: "profiles/4d6738d9-3f79-4eb4-9710-a09be37317fc.webp"
 *                 nombre: "Tecnología"
 *                 imagen_principal_url: "https://aki.34098949243be3984ed5ccb87a8d8315.r2.cloudflarestorage.com/events/936224a8-d9a0-48b0-a225-be437f7116ab.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ac25cf9f04abf4e8f5b343c3f5134091%2F20260627%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260627T211521Z&X-Amz-Expires=3600&X-Amz-Signature=9c926d4dcc862abab7b4f55cc85280800d6bf1ed971e7b0e2028a34eceb83420&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
 *       400:
 *         description: "Faltan campos obligatorios para generar el Evento"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Faltan campos obligatorios: titulo, descripcion, id_estado, id_municipio, id_ciudad, id_categoria, direccion, telefono, correo, fecha_inicio, fecha_finalizacion, hora_inicio, hora_finalizacion"
 *             example:
 *               success: false
 *               message: "Faltan campos obligatorios: titulo, descripcion, id_estado, id_municipio, id_ciudad, id_categoria, direccion, telefono, correo, fecha_inicio, fecha_finalizacion, hora_inicio, hora_finalizacion"
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateJWT, upload.single('imagen_principal'), createEvent);

/**
 * @openapi
 * /api/events/{id}:
 *   put:
 *     summary: Modifica las propiedades de un evento existente
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a actualizar
 *         example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Conferencia de Tecnología"
 *               descripcion:
 *                 type: string
 *                 example: "Evento sobre inteligencia artificial"
 *               id_estado:
 *                 type: integer
 *                 example: 6
 *               id_municipio:
 *                 type: integer
 *                 example: 50
 *               id_ciudad:
 *                 type: integer
 *                 example: 5
 *               id_categoria:
 *                 type: integer
 *                 example: 7
 *               direccion:
 *                 type: string
 *                 example: "Av. Reforma 123"
 *               telefono:
 *                 type: string
 *                 example: "0412-0000000"
 *               correo:
 *                 type: string
 *                 example: "luisrlvarezs@gmail.com"
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *                 example: "2025-10-05"
 *               fecha_finalizacion:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-05"
 *               hora_inicio:
 *                 type: string
 *                 format: time
 *                 example: "12:00:00"
 *               hora_finalizacion:
 *                 type: string
 *                 format: time
 *                 example: "15:00:00"
 *               estado:
 *                 type: boolean
 *                 example: true
 *               imagen_principal:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen del evento (archivo)
 *           example:
 *             titulo: "Conferencia de Tecnología"
 *             descripcion: "Evento sobre inteligencia artificial"
 *             id_estado: 6
 *             id_municipio: 50
 *             id_ciudad: 5
 *             id_categoria: 7
 *             direccion: "Av. Reforma 123"
 *             telefono: "0412-0000000"
 *             correo: "luisrlvarezs@gmail.com"
 *             fecha_inicio: "2025-10-05"
 *             fecha_finalizacion: "2025-05-05"
 *             hora_inicio: "12:00:00"
 *             hora_finalizacion: "15:00:00"
 *             estado: true
 *             imagen_principal: "(archivo binario)"
 *     responses:
 *       200:
 *         description: "Evento actualizado exitosamente (success true, data updatedEvent)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_evento:
 *                       type: integer
 *                       example: 3
 *                     titulo:
 *                       type: string
 *                       example: "Conferencia de Tecnología"
 *                     descripcion:
 *                       type: string
 *                       example: "Evento sobre inteligencia artificial"
 *                     id_estado:
 *                       type: integer
 *                       example: 6
 *                     id_municipio:
 *                       type: integer
 *                       example: 50
 *                     id_ciudad:
 *                       type: integer
 *                       example: 5
 *                     id_categoria:
 *                       type: integer
 *                       example: 7
 *                     direccion:
 *                       type: string
 *                       example: "Av. Reforma 123"
 *                     telefono:
 *                       type: string
 *                       example: "0412-0000000"
 *                     correo:
 *                       type: string
 *                       example: "luisrlvarezs@gmail.com"
 *                     fecha_inicio:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-05T04:00:00.000Z"
 *                     fecha_finalizacion:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-05T04:00:00.000Z"
 *                     hora_inicio:
 *                       type: string
 *                       example: "12:00:00"
 *                     hora_finalizacion:
 *                       type: string
 *                       example: "15:00:00"
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-28T02:01:24.351Z"
 *                     actualizado_en:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-28T02:10:03.082Z"
 *                     imagen_principal:
 *                       type: string
 *                       example: "events/e254438d-70ea-48c7-aae0-b619df8059cc.webp"
 *                     imagen_principal_url:
 *                       type: string
 *                       example: "https://aki.34098949243be3984ed5ccb87a8d8315.r2.cloudflarestorage.com/events/e254438d-70ea-48c7-aae0-b619df8059cc.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ac25cf9f04abf4e8f5b343c3f5134091%2F20260627%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260627T221004Z&X-Amz-Expires=3600&X-Amz-Signature=a9340220f7683f5e3e0fdb70861226cfe906be8c54027dfc5485d5e617e84677&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     creador_nombre:
 *                       type: string
 *                       example: "Luis"
 *                     creador_apellidos:
 *                       type: string
 *                       example: "Alvarez"
 *                     creador_foto:
 *                       type: string
 *                       example: "profiles/4d6738d9-3f79-4eb4-9710-a09be37317fc.webp"
 *                     nombre:
 *                       type: string
 *                       description: "Nombre de la categoría"
 *                       example: "Tecnología"
 *             example:
 *               success: true
 *               data:
 *                 id_evento: 3
 *                 titulo: "Conferencia de Tecnología"
 *                 descripcion: "Evento sobre inteligencia artificial"
 *                 id_estado: 6
 *                 id_municipio: 50
 *                 id_ciudad: 5
 *                 direccion: "Av. Reforma 123"
 *                 telefono: "0412-0000000"
 *                 correo: "luisrlvarezs@gmail.com"
 *                 id_categoria: 7
 *                 fecha_inicio: "2025-10-05T04:00:00.000Z"
 *                 fecha_finalizacion: "2025-05-05T04:00:00.000Z"
 *                 hora_inicio: "12:00:00"
 *                 hora_finalizacion: "15:00:00"
 *                 estado: true
 *                 fecha_registro: "2026-06-28T02:01:24.351Z"
 *                 actualizado_en: "2026-06-28T02:10:03.082Z"
 *                 imagen_principal: "events/e254438d-70ea-48c7-aae0-b619df8059cc.webp"
 *                 imagen_principal_url: "https://aki.34098949243be3984ed5ccb87a8d8315.r2.cloudflarestorage.com/events/e254438d-70ea-48c7-aae0-b619df8059cc.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ac25cf9f04abf4e8f5b343c3f5134091%2F20260627%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260627T221004Z&X-Amz-Expires=3600&X-Amz-Signature=a9340220f7683f5e3e0fdb70861226cfe906be8c54027dfc5485d5e617e84677&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
 *                 id_usuario: 1
 *                 creador_nombre: "Luis"
 *                 creador_apellidos: "Alvarez"
 *                 creador_foto: "profiles/4d6738d9-3f79-4eb4-9710-a09be37317fc.webp"
 *                 nombre: "Tecnología"
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para modificar este evento
 *       404:
 *         description: Evento no encontrado
 *       400:
 *         description: ID inválido o imagen no procesable
 */
router.put('/:id', authenticateJWT, upload.single('imagen_principal'), updateEvent);

/**
 * @openapi
 * /api/events/{id}/estado:
 *   patch:
 *     summary: Cambia el estado (activar/desactivar) de un evento
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a modificar
 *         example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: boolean
 *                 example: false
 *           example:
 *             estado: false
 *     responses:
 *       200:
 *         description: "Estado del evento actualizado exitosamente (success true, data updatedEvent)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Evento desactivado exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_evento:
 *                       type: integer
 *                       example: 12
 *                     estado:
 *                       type: boolean
 *                       example: false
 *             example:
 *               success: true
 *               message: "Evento desactivado exitosamente"
 *               data:
 *                 id_evento: 12
 *                 estado: false
 *       400:
 *         description: "El campo estado es requerido y debe ser booleano (true/false)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "El campo estado es requerido y debe ser booleano (true/false)"
 *             example:
 *               success: false
 *               message: "El campo estado es requerido y debe ser booleano (true/false)"
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para modificar este evento
 *       404:
 *         description: Evento no encontrado
 */
router.patch('/:id/estado', authenticateJWT, toggleEventEstado);

/**
 * @openapi
 * /api/events/{id}:
 *   delete:
 *     summary: Realiza la eliminación permanente de un evento (solo administradores)
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a eliminar
 *         example: 2
 *     responses:
 *       200:
 *         description: "Evento eliminado permanentemente (success true, data deletedEvent)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Evento eliminado permanentemente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_evento:
 *                       type: integer
 *                       example: 2
 *                     titulo:
 *                       type: string
 *                       example: "Conferencia de Tecnología 2025"
 *                     descripcion:
 *                       type: string
 *                       example: "Evento sobre inteligencia artificial y machine learning aplicado a negocios"
 *                     id_estado:
 *                       type: integer
 *                       example: 4
 *                     id_municipio:
 *                       type: integer
 *                       example: 39
 *                     id_ciudad:
 *                       type: integer
 *                       example: 58
 *                     id_categoria:
 *                       type: integer
 *                       example: 7
 *                     direccion:
 *                       type: string
 *                       example: "Av. Reforma 123, Col. Centro, CDMX"
 *                     telefono:
 *                       type: string
 *                       example: "0412-0000000"
 *                     correo:
 *                       type: string
 *                       example: "luisrlvarezs@gmail.com"
 *                     fecha_inicio:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-01T04:00:00.000Z"
 *                     fecha_finalizacion:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-08-01T04:00:00.000Z"
 *                     hora_inicio:
 *                       type: string
 *                       example: "09:00:00"
 *                     hora_finalizacion:
 *                       type: string
 *                       example: "17:00:00"
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-28T01:15:20.993Z"
 *                     actualizado_en:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-28T01:55:50.767Z"
 *                     imagen_principal:
 *                       type: string
 *                       example: "events/936224a8-d9a0-48b0-a225-be437f7116ab.webp"
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     creador_nombre:
 *                       type: string
 *                       example: "Luis"
 *                     creador_apellidos:
 *                       type: string
 *                       example: "Alvarez"
 *                     creador_foto:
 *                       type: string
 *                       example: "profiles/4d6738d9-3f79-4eb4-9710-a09be37317fc.webp"
 *                     nombre:
 *                       type: string
 *                       description: "Nombre de la categoría"
 *                       example: "Tecnología"
 *             example:
 *               success: true
 *               message: "Evento eliminado permanentemente"
 *               data:
 *                 id_evento: 2
 *                 titulo: "Conferencia de Tecnología 2025"
 *                 descripcion: "Evento sobre inteligencia artificial y machine learning aplicado a negocios"
 *                 id_estado: 4
 *                 id_municipio: 39
 *                 id_ciudad: 58
 *                 direccion: "Av. Reforma 123, Col. Centro, CDMX"
 *                 telefono: "0412-0000000"
 *                 correo: "luisrlvarezs@gmail.com"
 *                 id_categoria: 7
 *                 fecha_inicio: "2025-03-01T04:00:00.000Z"
 *                 fecha_finalizacion: "2025-08-01T04:00:00.000Z"
 *                 hora_inicio: "09:00:00"
 *                 hora_finalizacion: "17:00:00"
 *                 estado: true
 *                 fecha_registro: "2026-06-28T01:15:20.993Z"
 *                 actualizado_en: "2026-06-28T01:55:50.767Z"
 *                 imagen_principal: "events/936224a8-d9a0-48b0-a225-be437f7116ab.webp"
 *                 id_usuario: 1
 *                 creador_nombre: "Luis"
 *                 creador_apellidos: "Alvarez"
 *                 creador_foto: "profiles/4d6738d9-3f79-4eb4-9710-a09be37317fc.webp"
 *                 nombre: "Tecnología"
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para eliminar eventos
 *       404:
 *         description: Evento no encontrado
 *       400:
 *         description: ID inválido
 */
router.delete('/:id', authenticateJWT, deleteEvent);

/**
 * @openapi
 * /api/events/user/me:
 *   get:
 *     summary: Obtiene los eventos del usuario autenticado
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado (true activo, false inactivo)
 *         example: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de eventos por página
 *         example: 5
 *     responses:
 *       200:
 *         description: "Lista de eventos del usuario obtenida exitosamente"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_evento:
 *                         type: integer
 *                         example: 3
 *                       titulo:
 *                         type: string
 *                         example: "Taller de Fotografía"
 *                       descripcion:
 *                         type: string
 *                         example: "Aprende técnicas de fotografía profesional"
 *                       fecha_inicio:
 *                         type: string
 *                         format: date
 *                         example: "2025-07-25"
 *                       imagen_principal_url:
 *                         type: string
 *                         nullable: true
 *                         example: "https://r2.cloudflare.com/events/def456.webp?signature=..."
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 5
 *                     total:
 *                       type: integer
 *                       example: 8
 *             example:
 *               success: true
 *               data:
 *                 - id_evento: 3
 *                   titulo: "Taller de Fotografía"
 *                   descripcion: "Aprende técnicas de fotografía profesional"
 *                   fecha_inicio: "2025-07-25"
 *                   imagen_principal_url: "https://r2.cloudflare.com/events/def456.webp?signature=..."
 *                 - id_evento: 7
 *                   titulo: "Curso de Programación"
 *                   descripcion: "Curso intensivo de JavaScript"
 *                   fecha_inicio: "2025-08-05"
 *                   imagen_principal_url: null
 *               pagination:
 *                 page: 1
 *                 limit: 5
 *                 total: 8
 *       401:
 *         description: No autorizado
 */
router.get('/user/me', authenticateJWT, getUserEvents);

export default router;