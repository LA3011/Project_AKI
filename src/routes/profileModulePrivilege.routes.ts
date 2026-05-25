import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import { 
  getRelations, 
  getRelationById, 
  getRelationsByProfile,
  createRelation, 
  updateRelation, 
  deleteRelation 
} from '../controllers/profileModulePrivilege.controller.js';

const router = Router();

/**
 * @openapi
 * /api/profile-module-privileges:
 *   get:
 *     summary: Obtiene la matriz completa de relaciones entre perfiles, módulos y privilegios
 *     tags: [Matriz de Privilegios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Matriz de control de accesos recuperada con éxito (success true, data relations)"
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
 *                       id_perfil_modulo_privilegio:
 *                         type: integer
 *                         example: 2
 *                       id_perfil:
 *                         type: integer
 *                         example: 4
 *                       id_modulo:
 *                         type: integer
 *                         example: 2
 *                       id_privilegio:
 *                         type: integer
 *                         example: 2
 *             example:
 *               success: true
 *               data:
 *                 - id_perfil_modulo_privilegio: 2
 *                   id_perfil: 4
 *                   id_modulo: 2
 *                   id_privilegio: 2
 *                 - id_perfil_modulo_privilegio: 3
 *                   id_perfil: 4
 *                   id_modulo: 5
 *                   id_privilegio: 2
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateJWT, getRelations);

/**
 * @openapi
 * /api/profile-module-privileges/{id}:
 *   get:
 *     summary: Recupera una asignación específica de la matriz mediante su ID único
 *     tags: [Matriz de Privilegios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la relación de privilegios a consultar
 *     responses:
 *       200:
 *         description: "Asignación de privilegios localizada y devuelta correctamente (success true, data relation)"
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
 *                     id_perfil_modulo_privilegio:
 *                       type: integer
 *                       example: 2
 *                     id_perfil:
 *                       type: integer
 *                       example: 4
 *                     id_modulo:
 *                       type: integer
 *                       example: 2
 *                     id_privilegio:
 *                       type: integer
 *                       example: 2
 *             example:
 *               success: true
 *               data:
 *                 id_perfil_modulo_privilegio: 2
 *                 id_perfil: 4
 *                 id_modulo: 2
 *                 id_privilegio: 2
 *       400:
 *         description: "El ID de la asignación no es válido o no fue proporcionado"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Asignación de privilegio no encontrada
 */
router.get('/:id', authenticateJWT, getRelationById);

/**
 * @openapi
 * /api/profile-module-privileges/profile/{id_perfil}:
 *   get:
 *     summary: Obtiene todos los módulos y privilegios asignados a un perfil específico
 *     tags: [Matriz de Privilegios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_perfil
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del perfil para consultar sus módulos y privilegios asignados
 *     responses:
 *       200:
 *         description: "Lista de accesos permitidos para el perfil recuperada con éxito (success true, data relations)"
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
 *                       id_perfil_modulo_privilegio:
 *                         type: integer
 *                         example: 2
 *                       id_perfil:
 *                         type: integer
 *                         example: 4
 *                       id_modulo:
 *                         type: integer
 *                         example: 2
 *                       id_privilegio:
 *                         type: integer
 *                         example: 2
 *             example:
 *               success: true
 *               data:
 *                 - id_perfil_modulo_privilegio: 2
 *                   id_perfil: 4
 *                   id_modulo: 2
 *                   id_privilegio: 2
 *                 - id_perfil_modulo_privilegio: 3
 *                   id_perfil: 4
 *                   id_modulo: 5
 *                   id_privilegio: 2
 *       400:
 *         description: "El ID de perfil suministrado no es válido"
 *       401:
 *         description: No autorizado
 */
router.get('/profile/:id_perfil', authenticateJWT, getRelationsByProfile);

/**
 * @openapi
 * /api/profile-module-privileges:
 *   post:
 *     summary: Concede un nuevo privilegio a un módulo para un perfil determinado
 *     tags: [Matriz de Privilegios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_perfil
 *               - id_modulo
 *               - id_privilegio
 *             properties:
 *               id_perfil:
 *                 type: string
 *                 example: "4"
 *               id_modulo:
 *                 type: string
 *                 example: "1"
 *               id_privilegio:
 *                 type: string
 *                 example: "2"
 *           example:
 *             id_perfil: "4"
 *             id_modulo: "1"
 *             id_privilegio: "2"
 *     responses:
 *       201:
 *         description: "Asignación guardada. Privilegio concedido de forma exitosa (success true, data newRelation)"
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
 *                     id_perfil_modulo_privilegio:
 *                       type: integer
 *                       example: 1
 *                     id_perfil:
 *                       type: integer
 *                       example: 4
 *                     id_modulo:
 *                       type: integer
 *                       example: 1
 *                     id_privilegio:
 *                       type: integer
 *                       example: 2
 *             example:
 *               success: true
 *               data:
 *                 id_perfil_modulo_privilegio: 1
 *                 id_perfil: 4
 *                 id_modulo: 1
 *                 id_privilegio: 2
 *       400:
 *         description: "Faltan parámetros obligatorios para definir el acceso (id_perfil, id_modulo, id_privilegio)"
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
 *                   example: "Faltan parámetros obligatorios para definir el acceso (id_perfil, id_modulo, id_privilegio)"
 *             example:
 *               success: false
 *               message: "Faltan parámetros obligatorios para definir el acceso (id_perfil, id_modulo, id_privilegio)"
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateJWT, createRelation);

/**
 * @openapi
 * /api/profile-module-privileges/{id}:
 *   put:
 *     summary: Modifica los componentes estructurales (perfil, módulo o privilegio) de una relación existente
 *     tags: [Matriz de Privilegios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la relación de privilegios a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_perfil:
 *                 type: string
 *                 example: "4"
 *               id_modulo:
 *                 type: string
 *                 example: "2"
 *               id_privilegio:
 *                 type: string
 *                 example: "2"
 *           example:
 *             id_perfil: "4"
 *             id_modulo: "2"
 *             id_privilegio: "2"
 *     responses:
 *       200:
 *         description: "Matriz de privilegios actualizada de manera satisfactoria (success true, data updatedRelation)"
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
 *                     id_perfil_modulo_privilegio:
 *                       type: integer
 *                       example: 1
 *                     id_perfil:
 *                       type: integer
 *                       example: 4
 *                     id_modulo:
 *                       type: integer
 *                       example: 2
 *                     id_privilegio:
 *                       type: integer
 *                       example: 2
 *             example:
 *               success: true
 *               data:
 *                 id_perfil_modulo_privilegio: 1
 *                 id_perfil: 4
 *                 id_modulo: 2
 *                 id_privilegio: 2
 *       400:
 *         description: "Cuerpo de solicitud vacío o identificador de ruta mal estructurado"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontró la relación solicitada para actualizar
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
 *                   example: "No se encontró la relación solicitada para actualizar"
 *             example:
 *               success: false
 *               message: "No se encontró la relación solicitada para actualizar"
 */
router.put('/:id', authenticateJWT, updateRelation);

/**
 * @openapi
 * /api/profile-module-privileges/{id}:
 *   delete:
 *     summary: Revoca el acceso eliminando permanentemente la relación de la matriz
 *     tags: [Matriz de Privilegios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la relación de privilegios a eliminar
 *     responses:
 *       200:
 *         description: "Permiso revocado y registro removido del sistema con éxito (success: true)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *             example:
 *               success: true
 *       400:
 *         description: "El ID enviado no cumple con los requisitos mínimos de eliminación"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: La asignación de privilegio especificada no existe en el sistema
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
 *                   example: "La asignación de privilegio especificada no existe en el sistema"
 *             example:
 *               success: false
 *               message: "La asignación de privilegio especificada no existe en el sistema"
 */
router.delete('/:id', authenticateJWT, deleteRelation);

export default router;