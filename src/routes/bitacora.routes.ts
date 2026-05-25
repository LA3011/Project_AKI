import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import {
    getLogs,
    getLogById,
    getLogsByAdmin,
    createLog
} from '../controllers/bitacora.controller.js';

const router = Router();

/**
 * @openapi
 * /api/bitacoras:
 *   get:
 *     summary: Recupera el historial completo de auditoría (Bitácora global)
 *     tags: [Bitácora de Auditoría]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Logs globales recuperados en orden cronológico inverso (success true, data logs)"
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateJWT, getLogs);

/**
 * @openapi
 * /api/bitacoras/{id}:
 *   get:
 *     summary: Obtiene el detalle técnico de un evento específico de la bitácora
 *     tags: [Bitácora de Auditoría]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Evento localizado de forma correcta (success true, data log)"
 *       400:
 *         description: "El ID de bitácora suministrado no es válido"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Registro de auditoría no encontrado
 */
router.get('/:id', authenticateJWT, getLogById);

/**
 * @openapi
 * /api/bitacoras/administrator/{id_administrador}:
 *   get:
 *     summary: Filtra todas las acciones y eventos ejecutados por un administrador específico
 *     tags: [Bitácora de Auditoría]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_administrador
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Rastro de acciones del usuario devuelto exitosamente (success true, data logs)"
 *       400:
 *         description: "El ID de administrador no es válido para la búsqueda forense"
 *       401:
 *         description: No autorizado
 */
router.get('/administrator/:id_administrador', authenticateJWT, getLogsByAdmin);

/**
 * @openapi
 * /api/bitacoras:
 *   post:
 *     summary: Registra un nuevo evento o acción dentro de la bitácora del sistema
 *     description: Nota arquitectónica - La bitácora es una estructura inmutable (Append-Only). No se permiten operaciones PUT o DELETE sobre este recurso.
 *     tags: [Bitácora de Auditoría]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_bitacora
 *               - id_administrador
 *               - id_modulo
 *               - accion
 *               - tabla_afectada
 *               - registro_id
 *             properties:
 *               id_bitacora:
 *                 type: string
 *                 example: "BIT-88492"
 *               id_administrador:
 *                 type: string
 *                 example: "USR-0012"
 *               id_modulo:
 *                 type: string
 *                 example: "MOD-INVENTORY"
 *               accion:
 *                 type: string
 *                 example: "UPDATE_STOCK"
 *               tabla_afectada:
 *                 type: string
 *                 example: "public.productos"
 *               registro_id:
 *                 type: string
 *                 example: "PROD-7721"
 *               ip_usuario:
 *                 type: string
 *                 example: "192.168.1.45"
 *               dispositivo:
 *                 type: string
 *                 example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-23T22:50:00.000Z"
 *     responses:
 *       201:
 *         description: "Entrada de bitácora registrada de forma inmutable (success true, data newLog)"
 *       400:
 *         description: "Faltan parámetros críticos de auditoría para asentar el registro"
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateJWT, createLog);

export default router;