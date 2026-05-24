import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} from '../controllers/client.controller.js';

const router = Router();

/**
 * @openapi
 * /api/clients:
 *   get:
 *     summary: Obtiene la lista completa de clientes
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Lista de clientes obtenida (success true, data clients)"
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
 *                       id_cliente:
 *                         type: integer
 *                         example: 1
 *                       id_usuario:
 *                         type: integer
 *                         example: 1
 *                       cedula:
 *                         type: string
 *                         example: "30123456"
 *                       fecha_nacimiento:
 *                         type: string
 *                         format: date-time
 *                         example: "2004-05-05T04:00:00.000Z"
 *                       sexo:
 *                         type: string
 *                         enum: [mas, fem]
 *                         example: "mas"
 *                       estado:
 *                         type: boolean
 *                         nullable: true
 *                         example: null
 *             example:
 *               success: true
 *               data:
 *                 - id_cliente: 1
 *                   id_usuario: 1
 *                   cedula: "30123456"
 *                   fecha_nacimiento: "2004-05-05T04:00:00.000Z"
 *                   sexo: "mas"
 *                   estado: null
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateJWT, getClients);

/**
 * @openapi
 * /api/clients/{id}:
 *   get:
 *     summary: Obtiene un cliente específico por su ID de cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente a consultar
 *     responses:
 *       200:
 *         description: "Datos del cliente obtenidos (success true, data client)"
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
 *                     id_cliente:
 *                       type: integer
 *                       example: 1
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     cedula:
 *                       type: string
 *                       example: "30123456"
 *                     fecha_nacimiento:
 *                       type: string
 *                       format: date-time
 *                       example: "2004-05-05T04:00:00.000Z"
 *                     sexo:
 *                       type: string
 *                       enum: [mas, fem]
 *                       example: "mas"
 *                     estado:
 *                       type: boolean
 *                       nullable: true
 *                       example: null
 *             example:
 *               success: true
 *               data:
 *                 id_cliente: 1
 *                 id_usuario: 1
 *                 cedula: "30123456"
 *                 fecha_nacimiento: "2004-05-05T04:00:00.000Z"
 *                 sexo: "mas"
 *                 estado: null
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/:id', authenticateJWT, getClientById);

/**
 * @openapi
 * /api/clients:
 *   post:
 *     summary: Registra un nuevo perfil de cliente asociado a un usuario existente
 *     tags: [Clientes]
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
 *               - cedula
 *               - fecha_nacimiento
 *               - sexo
 *             properties:
 *               id_usuario:
 *                 type: string
 *                 example: "1"
 *               cedula:
 *                 type: integer
 *                 example: 25123456
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *                 example: "1995-08-24"
 *               sexo:
 *                 type: string
 *                 enum: [mas, fem]
 *                 example: "mas"
 *           example:
 *             id_usuario: "1"
 *             cedula: 25123456
 *             fecha_nacimiento: "1995-08-24"
 *             sexo: "mas"
 *     responses:
 *       201:
 *         description: "Cliente creado exitosamente (success true, data newClient)"
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
 *                     id_cliente:
 *                       type: integer
 *                       example: 1
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     cedula:
 *                       type: string
 *                       example: "25123456"
 *                     fecha_nacimiento:
 *                       type: string
 *                       format: date-time
 *                       example: "1995-08-24T04:00:00.000Z"
 *                     sexo:
 *                       type: string
 *                       enum: [mas, fem]
 *                       example: "mas"
 *                     estado:
 *                       type: boolean
 *                       nullable: true
 *                       example: null
 *             example:
 *               success: true
 *               data:
 *                 id_cliente: 1
 *                 id_usuario: 1
 *                 cedula: "25123456"
 *                 fecha_nacimiento: "1995-08-24T04:00:00.000Z"
 *                 sexo: "mas"
 *                 estado: null
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateJWT, createClient);

/**
 * @openapi
 * /api/clients/{id}:
 *   put:
 *     summary: Actualiza los datos de un cliente existente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: integer
 *                 example: 25999888
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *                 example: "1995-08-25"
 *               sexo:
 *                 type: string
 *                 enum: [mas, fem]
 *                 example: "fem"
 *     responses:
 *       200:
 *         description: "Cliente actualizado exitosamente (success true, data updatedClient)"
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
 *                     id_cliente:
 *                       type: integer
 *                       example: 1
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     cedula:
 *                       type: string
 *                       example: "30123456"
 *                     fecha_nacimiento:
 *                       type: string
 *                       format: date-time
 *                       example: "2004-05-05T04:00:00.000Z"
 *                     sexo:
 *                       type: string
 *                       enum: [mas, fem]
 *                       example: "mas"
 *                     estado:
 *                       type: boolean
 *                       nullable: true
 *                       example: null
 *             example:
 *               success: true
 *               data:
 *                 id_cliente: 1
 *                 id_usuario: 1
 *                 cedula: "30123456"
 *                 fecha_nacimiento: "2004-05-05T04:00:00.000Z"
 *                 sexo: "mas"
 *                 estado: null
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cliente no encontrado
 */
router.put('/:id', authenticateJWT, updateClient);

/**
 * @openapi
 * /api/clients/{id}:
 *   delete:
 *     summary: Desactiva de forma lógica a un cliente (desactivacion)
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente a desactivar
 *     responses:
 *       200:
 *         description: Cliente desactivado con éxito
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
 *                     id_cliente:
 *                       type: integer
 *                       example: 1
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     cedula:
 *                       type: string
 *                       example: "30123456"
 *                     fecha_nacimiento:
 *                       type: string
 *                       format: date-time
 *                       example: "2004-05-05T04:00:00.000Z"
 *                     sexo:
 *                       type: string
 *                       enum: [mas, fem]
 *                       example: "mas"
 *                     estado:
 *                       type: boolean
 *                       example: false
 *             example:
 *               success: true
 *               data:
 *                 id_cliente: 1
 *                 id_usuario: 1
 *                 cedula: "30123456"
 *                 fecha_nacimiento: "2004-05-05T04:00:00.000Z"
 *                 sexo: "mas"
 *                 estado: false
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cliente no encontrado
 */
router.delete('/:id', authenticateJWT, deleteClient);

export default router;