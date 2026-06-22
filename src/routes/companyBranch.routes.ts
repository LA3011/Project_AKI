import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import { 
  getBranches, 
  getBranchById, 
  createBranch, 
  updateBranch, 
  deleteBranch 
} from '../controllers/companyBranch.controller.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

/**
 * @openapi
 * /api/company-branches:
 *   get:
 *     summary: Obtiene todas las sucursales con URLs firmadas para sus fotos
 *     tags: [Sucursales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sucursales obtenida exitosamente
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
 *                         example: 14
 *                       id_empresa:
 *                         type: integer
 *                         nullable: true
 *                         example: 13
 *                       id_estado:
 *                         type: integer
 *                         nullable: true
 *                         example: 2
 *                       id_municipio:
 *                         type: integer
 *                         nullable: true
 *                         example: 2
 *                       id_ciudad:
 *                         type: integer
 *                         nullable: true
 *                         example: 2
 *                       nombre_sucursal:
 *                         type: string
 *                         example: "Mi sucursal S.A. 22"
 *                       direccion:
 *                         type: string
 *                         example: "maracay 22"
 *                       telefono:
 *                         type: string
 *                         example: "041200000002"
 *                       correo:
 *                         type: string
 *                         format: email
 *                         example: "test@gmail.com2"
 *                       foto_principal:
 *                         type: string
 *                         nullable: true
 *                         example: "companiesBranches/principal/d6b292bd-d33d-4913-bb46-500d4df29682.webp"
 *                         description: Key de la imagen en R2
 *                       foto_principal_url:
 *                         type: string
 *                         nullable: true
 *                         example: "https://aki.r2.cloudflarestorage.com/companiesBranches/principal/d6b292bd-d33d-4913-bb46-500d4df29682.webp?X-Amz-Algorithm=..."
 *                         description: URL firmada temporal de la foto (expira en 1 hora)
 *                       descripcion:
 *                         type: string
 *                         example: "Descripción de mi empresa22"
 *                       estado:
 *                         type: boolean
 *                         example: true
 *                       fecha_creacion:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-22T01:28:31.380Z"
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', authenticateJWT, getBranches);

/**
 * @openapi
 * /api/company-branches/{id}:
 *   get:
 *     summary: Obtiene una sucursal por ID con URL firmada para su foto
 *     tags: [Sucursales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sucursal
 *         example: "14"
 *     responses:
 *       200:
 *         description: Sucursal obtenida exitosamente
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
 *                       example: 14
 *                     id_empresa:
 *                       type: integer
 *                       nullable: true
 *                       example: 13
 *                     id_estado:
 *                       type: integer
 *                       nullable: true
 *                       example: 2
 *                     id_municipio:
 *                       type: integer
 *                       nullable: true
 *                       example: 2
 *                     id_ciudad:
 *                       type: integer
 *                       nullable: true
 *                       example: 2
 *                     nombre_sucursal:
 *                       type: string
 *                       example: "Mi sucursal S.A. 22"
 *                     direccion:
 *                       type: string
 *                       example: "maracay 22"
 *                     telefono:
 *                       type: string
 *                       example: "041200000002"
 *                     correo:
 *                       type: string
 *                       format: email
 *                       example: "test@gmail.com2"
 *                     foto_principal:
 *                       type: string
 *                       nullable: true
 *                       example: "companiesBranches/principal/d6b292bd-d33d-4913-bb46-500d4df29682.webp"
 *                       description: Key de la imagen en R2
 *                     foto_principal_url:
 *                       type: string
 *                       nullable: true
 *                       example: "https://aki.r2.cloudflarestorage.com/companiesBranches/principal/d6b292bd-d33d-4913-bb46-500d4df29682.webp?X-Amz-Algorithm=..."
 *                       description: URL firmada temporal de la foto (expira en 1 hora)
 *                     descripcion:
 *                       type: string
 *                       example: "Descripción de mi empresa22"
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     fecha_creacion:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-22T01:28:31.380Z"
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Sucursal no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', authenticateJWT, getBranchById);

/**
 * @openapi
 * /api/company-branches:
 *   post:
 *     summary: Crea una nueva sucursal con foto
 *     tags: [Sucursales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_sucursal
 *               - direccion
 *               - telefono
 *               - correo
 *               - descripcion
 *               - id_empresa
 *               - id_estado
 *               - id_municipio
 *               - id_ciudad
 *             properties:
 *               nombre_sucursal:
 *                 type: string
 *                 example: "Mi sucursal S.A. 22"
 *                 description: Nombre de la sucursal
 *               direccion:
 *                 type: string
 *                 example: "maracay 22"
 *                 description: Dirección de la sucursal
 *               telefono:
 *                 type: string
 *                 example: "041200000002"
 *                 description: Teléfono de la sucursal
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "test@gmail.com2"
 *                 description: Correo de la sucursal
 *               descripcion:
 *                 type: string
 *                 example: "Descripción de mi empresa22"
 *                 description: Descripción de la sucursal
 *               id_empresa:
 *                 type: string
 *                 example: "13"
 *                 description: ID de la empresa (opcional)
 *               id_estado:
 *                 type: string
 *                 example: "2"
 *                 description: ID del estado (opcional)
 *               id_municipio:
 *                 type: string
 *                 example: "2"
 *                 description: ID del municipio (opcional)
 *               id_ciudad:
 *                 type: string
 *                 example: "2"
 *                 description: ID de la ciudad (opcional)
 *               foto_principal:
 *                 type: string
 *                 format: binary
 *                 description: |
 *                   Foto principal de la sucursal (opcional).
 *                   Formatos permitidos: JPEG, PNG, WEBP, GIF.
 *                   Tamaño máximo: 5MB.
 *                   La imagen será optimizada a 800x600px en formato WEBP.
 *     responses:
 *       201:
 *         description: Sucursal creada exitosamente
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
 *                       example: 14
 *                     id_empresa:
 *                       type: integer
 *                       nullable: true
 *                       example: 13
 *                     id_estado:
 *                       type: integer
 *                       nullable: true
 *                       example: 2
 *                     id_municipio:
 *                       type: integer
 *                       nullable: true
 *                       example: 2
 *                     id_ciudad:
 *                       type: integer
 *                       nullable: true
 *                       example: 2
 *                     nombre_sucursal:
 *                       type: string
 *                       example: "Mi sucursal S.A. 22"
 *                     direccion:
 *                       type: string
 *                       example: "maracay 22"
 *                     telefono:
 *                       type: string
 *                       example: "041200000002"
 *                     correo:
 *                       type: string
 *                       format: email
 *                       example: "test@gmail.com2"
 *                     foto_principal:
 *                       type: string
 *                       nullable: true
 *                       example: "companiesBranches/principal/d6b292bd-d33d-4913-bb46-500d4df29682.webp"
 *                       description: Key de la imagen en R2
 *                     foto_principal_url:
 *                       type: string
 *                       nullable: true
 *                       example: "https://aki.r2.cloudflarestorage.com/companiesBranches/principal/d6b292bd-d33d-4913-bb46-500d4df29682.webp?X-Amz-Algorithm=..."
 *                       description: URL firmada temporal de la foto (expira en 1 hora)
 *                     descripcion:
 *                       type: string
 *                       example: "Descripción de mi empresa22"
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     fecha_creacion:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-22T01:28:31.380Z"
 *       400:
 *         description: Faltan campos obligatorios o error en la imagen
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
 *                 error:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       413:
 *         description: La imagen excede el tamaño máximo (5MB)
 *       415:
 *         description: Formato de imagen no permitido
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', upload.single('foto_principal'), authenticateJWT, createBranch);

/**
 * @openapi
 * /api/company-branches/{id}:
 *   put:
 *     summary: Actualiza una sucursal (incluyendo foto)
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
 *         example: "14"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_sucursal:
 *                 type: string
 *                 example: "Mi sucursal S.A. 4"
 *                 description: Nombre de la sucursal (opcional)
 *               direccion:
 *                 type: string
 *                 example: "maracay 4"
 *                 description: Dirección de la sucursal (opcional)
 *               telefono:
 *                 type: string
 *                 example: "041200000004"
 *                 description: Teléfono de la sucursal (opcional)
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "test@gmail.com4"
 *                 description: Correo de la sucursal (opcional)
 *               descripcion:
 *                 type: string
 *                 example: "Descripción de mi empresa4"
 *                 description: Descripción de la sucursal (opcional)
 *               id_empresa:
 *                 type: string
 *                 example: "13"
 *                 description: ID de la empresa (opcional)
 *               id_estado:
 *                 type: string
 *                 example: "4"
 *                 description: ID del estado (opcional)
 *               id_municipio:
 *                 type: string
 *                 example: "4"
 *                 description: ID del municipio (opcional)
 *               id_ciudad:
 *                 type: string
 *                 example: "4"
 *                 description: ID de la ciudad (opcional)
 *               foto_principal:
 *                 type: string
 *                 format: binary
 *                 description: |
 *                   Nueva foto principal (opcional).
 *                   Si se envía, reemplazará a la foto actual.
 *                   La foto anterior será eliminada de R2.
 *                   Formatos permitidos: JPEG, PNG, WEBP, GIF.
 *                   Tamaño máximo: 5MB.
 *     responses:
 *       200:
 *         description: Sucursal actualizada exitosamente
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
 *                       example: 14
 *                     id_empresa:
 *                       type: integer
 *                       nullable: true
 *                       example: 13
 *                     id_estado:
 *                       type: integer
 *                       nullable: true
 *                       example: 4
 *                     id_municipio:
 *                       type: integer
 *                       nullable: true
 *                       example: 4
 *                     id_ciudad:
 *                       type: integer
 *                       nullable: true
 *                       example: 4
 *                     nombre_sucursal:
 *                       type: string
 *                       example: "Mi sucursal S.A. 4"
 *                     direccion:
 *                       type: string
 *                       example: "maracay 4"
 *                     telefono:
 *                       type: string
 *                       example: "041200000004"
 *                     correo:
 *                       type: string
 *                       format: email
 *                       example: "test@gmail.com4"
 *                     foto_principal:
 *                       type: string
 *                       nullable: true
 *                       example: "companiesBranches/principal/39a9b9a1-a063-4672-addf-cd48149b301e.webp"
 *                       description: Key de la imagen en R2
 *                     foto_principal_url:
 *                       type: string
 *                       nullable: true
 *                       example: "https://aki.r2.cloudflarestorage.com/companiesBranches/principal/39a9b9a1-a063-4672-addf-cd48149b301e.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ac25cf9f04abf4e8f5b343c3f5134091%2F20260621%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260621T214125Z&X-Amz-Expires=3600&X-Amz-Signature=fd63b4d7760cb804e1dac3c915a436c7a14a844977682900ad3ab023268eae30&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
 *                       description: URL firmada temporal de la foto (expira en 1 hora)
 *                     descripcion:
 *                       type: string
 *                       example: "Descripción de mi empresa4"
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     fecha_creacion:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-22T01:28:31.380Z"
 *             example:
 *               success: true
 *               data:
 *                 id_sucursal: 14
 *                 id_empresa: 13
 *                 id_estado: 4
 *                 id_municipio: 4
 *                 id_ciudad: 4
 *                 nombre_sucursal: "Mi sucursal S.A. 4"
 *                 direccion: "maracay 4"
 *                 telefono: "041200000004"
 *                 correo: "test@gmail.com4"
 *                 foto_principal: "companiesBranches/principal/39a9b9a1-a063-4672-addf-cd48149b301e.webp"
 *                 foto_principal_url: "https://aki.r2.cloudflarestorage.com/companiesBranches/principal/39a9b9a1-a063-4672-addf-cd48149b301e.webp?X-Amz-Algorithm=..."
 *                 descripcion: "Descripción de mi empresa4"
 *                 estado: true
 *                 fecha_creacion: "2026-06-22T01:28:31.380Z"
 *       400:
 *         description: ID inválido o error en la imagen
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
 *                 error:
 *                   type: string
 *       401:
 *         description: No autorizado - Se requiere token JWT válido
 *       404:
 *         description: Sucursal no encontrada
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
 *                   example: "Sucursal no encontrada"
 *       413:
 *         description: La imagen excede el tamaño máximo permitido (5MB)
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
 *                   example: "La imagen no puede exceder los 5MB"
 *       415:
 *         description: Formato de imagen no permitido
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
 *                   example: "Formato de imagen no permitido. Solo se aceptan: JPEG, PNG, WEBP, GIF"
 *       500:
 *         description: Error interno del servidor
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
 *                   example: "Error interno del servidor"
 *                 error:
 *                   type: string
 */
router.put('/:id', upload.single('foto_principal'), authenticateJWT, updateBranch);

/**
 * @openapi
 * /api/company-branches/{id}:
 *   delete:
 *     summary: Elimina (desactiva) una sucursal y su foto de R2
 *     tags: [Sucursales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sucursal a eliminar
 *         example: "13"
 *     responses:
 *       200:
 *         description: Sucursal desactivada exitosamente
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
 *                       example: 13
 *                     id_empresa:
 *                       type: integer
 *                       nullable: true
 *                       example: 13
 *                     id_estado:
 *                       type: integer
 *                       nullable: true
 *                       example: 2
 *                     id_municipio:
 *                       type: integer
 *                       nullable: true
 *                       example: 2
 *                     id_ciudad:
 *                       type: integer
 *                       nullable: true
 *                       example: 2
 *                     nombre_sucursal:
 *                       type: string
 *                       example: "Mi sucursal S.A. 22"
 *                     direccion:
 *                       type: string
 *                       example: "maracay 22"
 *                     telefono:
 *                       type: string
 *                       example: "041200000002"
 *                     correo:
 *                       type: string
 *                       format: email
 *                       example: "test@gmail.com2"
 *                     foto_principal:
 *                       type: string
 *                       nullable: true
 *                       example: "companiesBranches/principal/8e54ee3f-a720-4ed0-b17d-bdf5185996f4.webp"
 *                       description: Key de la imagen (eliminada de R2 pero se mantiene en BD para referencia)
 *                     descripcion:
 *                       type: string
 *                       example: "Descripción de mi empresa22"
 *                     estado:
 *                       type: boolean
 *                       example: false
 *                     fecha_creacion:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-22T01:21:27.676Z"
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Sucursal no encontrada o inactiva
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', authenticateJWT, deleteBranch);

export default router;