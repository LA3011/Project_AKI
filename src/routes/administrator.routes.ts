import { Router } from 'express';
import { 
  getAdministrators, 
  getAdministratorById, 
  createAdministrator, 
  updateAdministrator, 
  deleteAdministrator 
} from '../controllers/administrator.controller.js';
import { authenticateJWT } from '../middlewares/auth.handler.js';

const router = Router();

/**
 * @openapi
 * /api/administrators:
 *   get:
 *     summary: Obtiene la lista global de administradores
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Lista de administradores obtenida (success true, data administrators)"
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
 *                       id_administrador:
 *                         type: integer
 *                         example: 1
 *                       id_usuario:
 *                         type: integer
 *                         example: 1
 *                       id_perfil:
 *                         type: integer
 *                         example: 4
 *                       estado:
 *                         type: boolean
 *                         nullable: true
 *                         example: true
 *             example:
 *               success: true
 *               data:
 *                 - id_administrador: 1
 *                   id_usuario: 1
 *                   id_perfil: 4
 *                   estado: true
 *                 - id_administrador: 2
 *                   id_usuario: 1
 *                   id_perfil: 4
 *                   estado: true
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateJWT, getAdministrators);

/**
 * @openapi
 * /api/administrators/{id}:
 *   get:
 *     summary: Obtiene los detalles de un administrador por su ID
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del administrador a consultar
 *     responses:
 *       200:
 *         description: "Datos del administrador obtenidos (success true, data admin)"
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
 *                     id_administrador:
 *                       type: integer
 *                       example: 1
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     id_perfil:
 *                       type: integer
 *                       example: 4
 *                     estado:
 *                       type: boolean
 *                       example: true
 *             example:
 *               success: true
 *               data:
 *                 id_administrador: 1
 *                 id_usuario: 1
 *                 id_perfil: 4
 *                 estado: true
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Administrador no encontrado
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
 *                   example: "Administrador no encontrado"
 *             example:
 *               success: false
 *               message: "Administrador no encontrado"
 */
router.get('/:id', authenticateJWT, getAdministratorById);

/**
 * @openapi
 * /api/administrators:
 *   post:
 *     summary: Registra un nuevo administrador asignándole un usuario y un perfil
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_usuario
 *               - id_perfil
 *             properties:
 *               id_usuario:
 *                 type: string
 *                 example: "1"
 *               id_perfil:
 *                 type: string
 *                 example: "4"
 *           example:
 *             id_usuario: "1"
 *             id_perfil: "4"
 *     responses:
 *       201:
 *         description: "Administrador creado exitosamente (success true, data newAdmin)"
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
 *                     id_administrador:
 *                       type: integer
 *                       example: 2
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     id_perfil:
 *                       type: integer
 *                       example: 4
 *                     estado:
 *                       type: boolean
 *                       nullable: true
 *                       example: null
 *             example:
 *               success: true
 *               data:
 *                 id_administrador: 2
 *                 id_usuario: 1
 *                 id_perfil: 4
 *                 estado: null
 *       400:
 *         description: "Faltan campos obligatorios para emitir a administrador (id_usuario, id_perfil)"
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
 *                   example: "Faltan campos obligatorios para emitir a administrador (id_usuario, id_perfil)"
 *             example:
 *               success: false
 *               message: "Faltan campos obligatorios para emitir a administrador (id_usuario, id_perfil)"
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateJWT, createAdministrator);

/**
 * @openapi
 * /api/administrators/{id}:
 *   put:
 *     summary: Actualiza el perfil asignado a un administrador existente
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del administrador a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: string
 *                 example: "1"
 *               id_perfil:
 *                 type: string
 *                 example: "4"
 *           example:
 *             id_usuario: "1"
 *             id_perfil: "4"
 *     responses:
 *       200:
 *         description: "Administrador actualizado exitosamente (success true, data updatedAdmin)"
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
 *                     id_administrador:
 *                       type: integer
 *                       example: 1
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     id_perfil:
 *                       type: integer
 *                       example: 4
 *                     estado:
 *                       type: boolean
 *                       example: true
 *             example:
 *               success: true
 *               data:
 *                 id_administrador: 1
 *                 id_usuario: 1
 *                 id_perfil: 4
 *                 estado: true
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Administrador no encontrado
 */
router.put('/:id', authenticateJWT, updateAdministrator);

/**
 * @openapi
 * /api/administrators/{id}:
 *   delete:
 *     summary: Cambia el estado del administrador a falso (Baja lógica)
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del administrador a desactivar
 *     responses:
 *       200:
 *         description: Administrador desactivado correctamente
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
 *                   example: "Administrador desactivado exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_administrador:
 *                       type: integer
 *                       example: 2
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     id_perfil:
 *                       type: integer
 *                       example: 4
 *                     estado:
 *                       type: boolean
 *                       example: false
 *             example:
 *               success: true
 *               message: "Administrador desactivado exitosamente"
 *               data:
 *                 id_administrador: 2
 *                 id_usuario: 1
 *                 id_perfil: 4
 *                 estado: false
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Administrador no encontrado
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
 *                   example: "Administrador no encontrado o ya inactivo"
 *             example:
 *               success: false
 *               message: "Administrador no encontrado o ya inactivo"
 */
router.delete('/:id', authenticateJWT, deleteAdministrator);

export default router;