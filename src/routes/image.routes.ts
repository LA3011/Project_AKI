import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import { getSignedImageUrlPost, getSignedUrls, listImagesByFolder } from '../controllers/image.controller.js';

const router = Router();

/**
 * @openapi
 * /api/images/list:
 *   get:
 *     summary: Lista imágenes en una carpeta específica con URLs firmadas
 *     tags: [Imágenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: folder
 *         required: true
 *         schema:
 *           type: string
 *           enum: [profiles, companies, branches, posts]
 *         description: Carpeta a listar
 *         example: profiles
 *       - in: query
 *         name: maxKeys
 *         schema:
 *           type: integer
 *           default: 50
 *           minimum: 1
 *           maximum: 200
 *         description: Máximo de imágenes a retornar
 *         example: 50
 *       - in: query
 *         name: continuationToken
 *         schema:
 *           type: string
 *         description: Token para obtener la siguiente página de resultados
 *       - in: query
 *         name: includeUrls
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Si incluye URLs firmadas en la respuesta
 *     responses:
 *       200:
 *         description: Lista de imágenes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 folder:
 *                   type: string
 *                   example: "profiles"
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       key:
 *                         type: string
 *                         example: "profiles/59679146-c83b-476e-82e6-d52d213795b7.webp"
 *                       size:
 *                         type: integer
 *                         example: 45678
 *                       lastModified:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-21T20:36:00.000Z"
 *                       url:
 *                         type: string
 *                         nullable: true
 *                         example: "https://aki.r2.cloudflarestorage.com/profiles/59679146-c83b-476e-82e6-d52d213795b7.webp?X-Amz-Algorithm=..."
 *                       exists:
 *                         type: boolean
 *                         example: true
 *                 continuationToken:
 *                   type: string
 *                   nullable: true
 *                 total:
 *                   type: integer
 *                   example: 15
 *                 limit:
 *                   type: integer
 *                   example: 50
 *                 timestamp:
 *                   type: integer
 *                   example: 1719012345678
 *       400:
 *         description: Error en la solicitud
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
 *       401:
 *         description: No autorizado - Se requiere token JWT válido
 *       500:
 *         description: Error interno del servidor
 */
router.get('/list', authenticateJWT, listImagesByFolder);

/**
 * @openapi
 * /api/image/signed-url:
 *   post:
 *     summary: Obtiene una URL firmada para una imagen específica
 *     tags: [Imágenes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *             properties:
 *               key:
 *                 type: string
 *                 example: "profiles/59679146-c83b-476e-82e6-d52d213795b7.webp"
 *                 description: Key de la imagen en R2
 *               expires:
 *                 type: integer
 *                 default: 3600
 *                 minimum: 60
 *                 maximum: 604800
 *                 example: 3600
 *                 description: Tiempo de expiración en segundos
 *     responses:
 *       200:
 *         description: URL firmada generada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 url:
 *                   type: string
 *                   example: "https://aki.r2.cloudflarestorage.com/profiles/59679146-c83b-476e-82e6-d52d213795b7.webp?X-Amz-Algorithm=..."
 *                 key:
 *                   type: string
 *                   example: "profiles/59679146-c83b-476e-82e6-d52d213795b7.webp"
 *                 expiresIn:
 *                   type: integer
 *                   example: 3600
 *                 timestamp:
 *                   type: integer
 *                   example: 1719012345678
 *       400:
 *         description: Error en la solicitud
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
 *       401:
 *         description: No autorizado - Se requiere token JWT válido
 *       404:
 *         description: Imagen no encontrada
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
 *                   example: "La imagen no existe"
 *                 key:
 *                   type: string
 *       500:
 *         description: Error interno del servidor
 */
router.post('/signed-url', authenticateJWT, getSignedImageUrlPost);

/**
 * @openapi
 * /api/images/signed-urls:
 *   post:
 *     summary: Obtiene URLs firmadas para múltiples imágenes (batch)
 *     tags: [Imágenes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - keys
 *             properties:
 *               keys:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *                 maxItems: 100
 *                 example: [
 *                   "profiles/59679146-c83b-476e-82e6-d52d213795b7.webp",
 *                   "companies/8781c1e4-923b-425f-851a-6f258a7b7361.webp",
 *                   "branches/abc123.webp"
 *                 ]
 *                 description: Array de keys de imágenes (máximo 100)
 *               expiresIn:
 *                 type: integer
 *                 default: 3600
 *                 minimum: 60
 *                 maximum: 604800
 *                 example: 3600
 *                 description: |
 *                   Tiempo de expiración en segundos para todas las URLs.
 *                   Mínimo: 60 segundos (1 minuto)
 *                   Máximo: 604800 segundos (7 días)
 *                   Por defecto: 3600 segundos (1 hora)
 *     responses:
 *       200:
 *         description: URLs firmadas generadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       key:
 *                         type: string
 *                         example: "profiles/59679146-c83b-476e-82e6-d52d213795b7.webp"
 *                         description: Key de la imagen
 *                       url:
 *                         type: string
 *                         example: "https://aki.r2.cloudflarestorage.com/profiles/59679146-c83b-476e-82e6-d52d213795b7.webp?X-Amz-Algorithm=..."
 *                         description: URL firmada para la imagen
 *                 expiresIn:
 *                   type: integer
 *                   example: 3600
 *                   description: Tiempo de expiración en segundos
 *                 timestamp:
 *                   type: integer
 *                   example: 1719012345678
 *                   description: Timestamp de generación de las URLs
 *             example:
 *               urls:
 *                 - key: "profiles/59679146-c83b-476e-82e6-d52d213795b7.webp"
 *                   url: "https://aki.r2.cloudflarestorage.com/profiles/59679146-c83b-476e-82e6-d52d213795b7.webp?X-Amz-Algorithm=..."
 *                 - key: "companies/8781c1e4-923b-425f-851a-6f258a7b7361.webp"
 *                   url: "https://aki.r2.cloudflarestorage.com/companies/8781c1e4-923b-425f-851a-6f258a7b7361.webp?X-Amz-Algorithm=..."
 *               expiresIn: 3600
 *               timestamp: 1719012345678
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               KeysRequeridas:
 *                 value:
 *                   message: "Se requiere un array de keys"
 *               KeysInvalidas:
 *                 value:
 *                   message: "No se proporcionaron keys válidas"
 *               LimiteExcedido:
 *                 value:
 *                   message: "Máximo 100 imágenes por petición"
 *       401:
 *         description: No autorizado - Se requiere token JWT válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token no proporcionado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al generar URLs firmadas"
 *                 error:
 *                   type: string
 */
router.post('/signed-urls', authenticateJWT, getSignedUrls);

export default router; 