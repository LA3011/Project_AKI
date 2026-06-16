import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import { 
  getBranches, 
  getBranchById, 
  createBranch, 
  updateBranch, 
  deleteBranch 
} from '../controllers/companyBranch.controller.js';

const router = Router();

/**
 * @openapi
 * /api/company-branches:
 *   get:
 *     summary: Obtiene el listado general de todas las sucursales
 *     tags: [Sucursales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Lista de sucursales obtenida (success: true, data: branches)"
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
 *                       id_sucursal:
 *                         type: integer
 *                         example: 3
 *                       id_empresa:
 *                         type: integer
 *                         example: 3
 *                       id_estado:
 *                         type: integer
 *                         example: 4
 *                       id_municipio:
 *                         type: integer
 *                         example: 11
 *                       id_ciudad:
 *                         type: integer
 *                         example: 10
 *                       nombre_sucursal:
 *                         type: string
 *                         example: "Sucursal Norte Prados"
 *                       direccion:
 *                         type: string
 *                         example: "Av. Principal con calle 4, Local 12-A"
 *                       telefono:
 *                         type: string
 *                         example: "02432345678"
 *                       correo:
 *                         type: string
 *                         example: "norte@inversionescentro.com"
 *                       foto_principal:
 *                         type: string
 *                         example: "https://images.com/sucursales/suc-901.png"
 *                       descripcion:
 *                         type: string
 *                         example: "Sede operativa de distribución para la zona norte."
 *                       estado:
 *                         type: boolean
 *                         example: false
 *                       fecha_creacion:
 *                         type: string
 *                         example: "17:54:15.132928"
 *             example:
 *               success: true
 *               data:
 *                 - id_sucursal: 3
 *                   id_empresa: 3
 *                   id_estado: 4
 *                   id_municipio: 11
 *                   id_ciudad: 10
 *                   nombre_sucursal: "Sucursal Norte Prados"
 *                   direccion: "Av. Principal con calle 4, Local 12-A"
 *                   telefono: "02432345678"
 *                   correo: "norte@inversionescentro.com"
 *                   foto_principal: "https://images.com/sucursales/suc-901.png"
 *                   descripcion: "Sede operativa de distribución para la zona norte."
 *                   estado: false
 *                   fecha_creacion: "17:54:15.132928"
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateJWT, getBranches);

/**
 * @openapi
 * /api/company-branches/{id}:
 *   get:
 *     summary: Obtiene la información de una sucursal por su ID
 *     tags: [Sucursales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sucursal a consultar
 *     responses:
 *       200:
 *         description: "Datos de la sucursal obtenidos (success: true, data: branch)"
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
 *                     id_sucursal:
 *                       type: integer
 *                       example: 3
 *                     id_empresa:
 *                       type: integer
 *                       example: 3
 *                     id_estado:
 *                       type: integer
 *                       example: 4
 *                     id_municipio:
 *                       type: integer
 *                       example: 11
 *                     id_ciudad:
 *                       type: integer
 *                       example: 10
 *                     nombre_sucursal:
 *                       type: string
 *                       example: "Sucursal Norte Prados"
 *                     direccion:
 *                       type: string
 *                       example: "Av. Principal con calle 4, Local 12-A"
 *                     telefono:
 *                       type: string
 *                       example: "02432345678"
 *                     correo:
 *                       type: string
 *                       example: "norte@inversionescentro.com"
 *                     foto_principal:
 *                       type: string
 *                       example: "https://images.com/sucursales/suc-901.png"
 *                     descripcion:
 *                       type: string
 *                       example: "Sede operativa de distribución para la zona norte."
 *                     estado:
 *                       type: boolean
 *                       example: false
 *                     fecha_creacion:
 *                       type: string
 *                       example: "17:54:15.132928"
 *             example:
 *               success: true
 *               data:
 *                 id_sucursal: 3
 *                 id_empresa: 3
 *                 id_estado: 4
 *                 id_municipio: 11
 *                 id_ciudad: 10
 *                 nombre_sucursal: "Sucursal Norte Prados"
 *                 direccion: "Av. Principal con calle 4, Local 12-A"
 *                 telefono: "02432345678"
 *                 correo: "norte@inversionescentro.com"
 *                 foto_principal: "https://images.com/sucursales/suc-901.png"
 *                 descripcion: "Sede operativa de distribución para la zona norte."
 *                 estado: false
 *                 fecha_creacion: "17:54:15.132928"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Sucursal no encontrada
 */
router.get('/:id', authenticateJWT, getBranchById);

/**
 * @openapi
 * /api/company-branches:
 *   post:
 *     summary: Crea una nueva sucursal vinculada a una empresa
 *     tags: [Sucursales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_empresa
 *               - id_estado
 *               - id_municipio
 *               - id_ciudad
 *               - nombre_sucursal
 *               - direccion
 *             properties:
 *               id_empresa:
 *                 type: string
 *                 example: "3"
 *               id_estado:
 *                 type: string
 *                 example: "4"
 *               id_municipio:
 *                 type: string
 *                 example: "11"
 *               id_ciudad:
 *                 type: string
 *                 example: "10"
 *               nombre_sucursal:
 *                 type: string
 *                 example: "Sucursal Norte Prados"
 *               direccion:
 *                 type: string
 *                 example: "Av. Principal con calle 4, Local 12-A"
 *               telefono:
 *                 type: string
 *                 example: "02432345678"
 *               correo:
 *                 type: string
 *                 example: "norte@inversionescentro.com"
 *               foto_principal:
 *                 type: string
 *                 example: "https://images.com/sucursales/suc-901.png"
 *               descripcion:
 *                 type: string
 *                 example: "Sede operativa de distribución para la zona norte."
 *           example:
 *             id_empresa: "3"
 *             id_estado: "4"
 *             id_municipio: "11"
 *             id_ciudad: "10"
 *             nombre_sucursal: "Sucursal Norte Prados"
 *             direccion: "Av. Principal con calle 4, Local 12-A"
 *             telefono: "02432345678"
 *             correo: "norte@inversionescentro.com"
 *             foto_principal: "https://images.com/sucursales/suc-901.png"
 *             descripcion: "Sede operativa de distribución para la zona norte."
 *     responses:
 *       201:
 *         description: "Sucursal registrada exitosamente (success: true, data: newBranch)"
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
 *                     id_sucursal:
 *                       type: integer
 *                       example: 1
 *                     id_empresa:
 *                       type: integer
 *                       example: 3
 *                     id_estado:
 *                       type: integer
 *                       example: 4
 *                     id_municipio:
 *                       type: integer
 *                       example: 11
 *                     id_ciudad:
 *                       type: integer
 *                       example: 10
 *                     nombre_sucursal:
 *                       type: string
 *                       example: "Sucursal Norte Prados"
 *                     direccion:
 *                       type: string
 *                       example: "Av. Principal con calle 4, Local 12-A"
 *                     telefono:
 *                       type: string
 *                       example: "02432345678"
 *                     correo:
 *                       type: string
 *                       example: "norte@inversionescentro.com"
 *                     foto_principal:
 *                       type: string
 *                       example: "https://images.com/sucursales/suc-901.png"
 *                     descripcion:
 *                       type: string
 *                       example: "Sede operativa de distribución para la zona norte."
 *                     estado:
 *                       type: boolean
 *                       nullable: true
 *                       example: null
 *                     fecha_creacion:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *             example:
 *               success: true
 *               data:
 *                 id_sucursal: 1
 *                 id_empresa: 3
 *                 id_estado: 4
 *                 id_municipio: 11
 *                 id_ciudad: 10
 *                 nombre_sucursal: "Sucursal Norte Prados"
 *                 direccion: "Av. Principal con calle 4, Local 12-A"
 *                 telefono: "02432345678"
 *                 correo: "norte@inversionescentro.com"
 *                 foto_principal: "https://images.com/sucursales/suc-901.png"
 *                 descripcion: "Sede operativa de distribución para la zona norte."
 *                 estado: true
 *                 fecha_creacion: 17:54:15.132928
 *       400:
 *         description: "Faltan campos obligatorios para generar la sucursal (nombre_sucursal, direccion, telefono, correo, descripcion)"
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
 *                   example: "Faltan campos obligatorios para generar la sucursal (nombre_sucursal, direccion, telefono, correo, descripcion)"
 *             example:
 *               success: false
 *               message: "Faltan campos obligatorios para generar la sucursal (nombre_sucursal, direccion, telefono, correo, descripcion)"
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateJWT, createBranch);

/**
 * @openapi
 * /api/company-branches/{id}:
 *   put:
 *     summary: Modifica los datos de localización o contacto de una sucursal existente
 *     tags: [Sucursales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sucursal a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_sucursal:
 *                 type: string
 *                 example: "Sucursal Norte Prados"
 *               direccion:
 *                 type: string
 *                 example: "Av. Principal con calle 4, Local 12-A"
 *               telefono:
 *                 type: string
 *                 example: "02432345678"
 *               correo:
 *                 type: string
 *                 example: "norte@inversionescentro.com"
 *               foto_principal:
 *                 type: string
 *                 example: "https://images.com/sucursales/suc-901.png"
 *               descripcion:
 *                 type: string
 *                 example: "Sede operativa de distribución para la zona norte."
 *               id_estado:
 *                 type: integer
 *                 example: 4
 *               id_municipio:
 *                 type: integer
 *                 example: 39
 *               id_ciudad:
 *                 type: integer
 *                 example: 58
 *           example:
 *             nombre_sucursal: "Sucursal Norte Prados"
 *             direccion: "Av. Principal con calle 4, Local 12-A"
 *             telefono: "02432345678"
 *             correo: "norte@inversionescentro.com"
 *             foto_principal: "https://images.com/sucursales/suc-901.png"
 *             descripcion: "Sede operativa de distribución para la zona norte."
 *             id_estado: 4
 *             id_municipio: 39
 *             id_ciudad: 58
 *     responses:
 *       200:
 *         description: "Sucursal actualizada exitosamente (success: true, data: updatedBranch)"
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
 *                     id_sucursal:
 *                       type: integer
 *                       example: 3
 *                     id_empresa:
 *                       type: integer
 *                       example: 3
 *                     id_estado:
 *                       type: integer
 *                       example: 4
 *                     id_municipio:
 *                       type: integer
 *                       example: 39
 *                     id_ciudad:
 *                       type: integer
 *                       example: 58
 *                     nombre_sucursal:
 *                       type: string
 *                       example: "Sucursal Norte Prados"
 *                     direccion:
 *                       type: string
 *                       example: "Av. Principal con calle 4, Local 12-A"
 *                     telefono:
 *                       type: string
 *                       example: "02432345678"
 *                     correo:
 *                       type: string
 *                       example: "norte@inversionescentro.com"
 *                     foto_principal:
 *                       type: string
 *                       example: "https://images.com/sucursales/suc-901.png"
 *                     descripcion:
 *                       type: string
 *                       example: "Sede operativa de distribución para la zona norte."
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     fecha_creacion:
 *                       type: string
 *                       example: "17:54:15.132928"
 *             example:
 *               success: true
 *               data:
 *                 id_sucursal: 3
 *                 id_empresa: 3
 *                 id_estado: 4
 *                 id_municipio: 39
 *                 id_ciudad: 58
 *                 nombre_sucursal: "Sucursal Norte Prados"
 *                 direccion: "Av. Principal con calle 4, Local 12-A"
 *                 telefono: "02432345678"
 *                 correo: "norte@inversionescentro.com"
 *                 foto_principal: "https://images.com/sucursales/suc-901.png"
 *                 descripcion: "Sede operativa de distribución para la zona norte."
 *                 estado: true
 *                 fecha_creacion: "17:54:15.132928"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Sucursal no encontrada
 */
router.put('/:id', authenticateJWT, updateBranch);

/**
 * @openapi
 * /api/company-branches/{id}:
 *   delete:
 *     summary: Desactiva de forma lógica una sucursal del sistema
 *     tags: [Sucursales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sucursal a desactivar
 *     responses:
 *       200:
 *         description: Sucursal dada de baja de manera lógica exitosamente
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
 *                   example: "Sucursal desactivada exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_sucursal:
 *                       type: integer
 *                       example: 3
 *                     id_empresa:
 *                       type: integer
 *                       example: 3
 *                     id_estado:
 *                       type: integer
 *                       example: 4
 *                     id_municipio:
 *                       type: integer
 *                       example: 11
 *                     id_ciudad:
 *                       type: integer
 *                       example: 10
 *                     nombre_sucursal:
 *                       type: string
 *                       example: "Sucursal Norte Prados"
 *                     direccion:
 *                       type: string
 *                       example: "Av. Principal con calle 4, Local 12-A"
 *                     telefono:
 *                       type: string
 *                       example: "02432345678"
 *                     correo:
 *                       type: string
 *                       example: "norte@inversionescentro.com"
 *                     foto_principal:
 *                       type: string
 *                       example: "https://images.com/sucursales/suc-901.png"
 *                     descripcion:
 *                       type: string
 *                       example: "Sede operativa de distribución para la zona norte."
 *                     estado:
 *                       type: boolean
 *                       example: false
 *                     fecha_creacion:
 *                       type: string
 *                       example: "17:54:15.132928"
 *             example:
 *               success: true
 *               message: "Sucursal desactivada exitosamente"
 *               data:
 *                 id_sucursal: 3
 *                 id_empresa: 3
 *                 id_estado: 4
 *                 id_municipio: 11
 *                 id_ciudad: 10
 *                 nombre_sucursal: "Sucursal Norte Prados"
 *                 direccion: "Av. Principal con calle 4, Local 12-A"
 *                 telefono: "02432345678"
 *                 correo: "norte@inversionescentro.com"
 *                 foto_principal: "https://images.com/sucursales/suc-901.png"
 *                 descripcion: "Sede operativa de distribución para la zona norte."
 *                 estado: false
 *                 fecha_creacion: "17:54:15.132928"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Sucursal no encontrada
 */
router.delete('/:id', authenticateJWT, deleteBranch);

export default router;