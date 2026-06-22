import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import {
    getCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany
} from '../controllers/company.controller.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

/**
 * @openapi
 * /api/companies:
 *   get:
 *     summary: Obtiene la lista completa de empresas registradas con URLs firmadas
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Lista de empresas obtenida exitosamente con URLs firmadas para los logos"
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
 *                   description: Lista de empresas con sus logos firmados
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_empresa:
 *                         type: integer
 *                         example: 10
 *                         description: ID único de la empresa
 *                       id_usuario:
 *                         type: integer
 *                         example: 28
 *                         description: ID del usuario propietario
 *                       id_categoria:
 *                         type: integer
 *                         nullable: true
 *                         example: 4
 *                         description: ID de la categoría de la empresa
 *                       id_estado:
 *                         type: integer
 *                         example: 4
 *                         description: ID del estado donde se encuentra la empresa
 *                       id_municipio:
 *                         type: integer
 *                         example: 39
 *                         description: ID del municipio donde se encuentra la empresa
 *                       id_ciudad:
 *                         type: integer
 *                         example: 58
 *                         description: ID de la ciudad donde se encuentra la empresa
 *                       nombre_comercial:
 *                         type: string
 *                         example: "Mi Empresa S.A."
 *                         description: Nombre comercial de la empresa
 *                       razon_social:
 *                         type: string
 *                         nullable: true
 *                         example: "Mi Empresa S.A."
 *                         description: Razón social de la empresa
 *                       rif:
 *                         type: string
 *                         nullable: true
 *                         example: "J-00000000-0"
 *                         description: RIF de la empresa
 *                       pagina_web:
 *                         type: string
 *                         nullable: true
 *                         example: "https://miempresa.com"
 *                         description: Página web de la empresa
 *                       logo:
 *                         type: string
 *                         nullable: true
 *                         example: "companies/logo/8781c1e4-923b-425f-851a-6f258a7b7361.webp"
 *                         description: |
 *                           Key de la imagen en R2 (no es una URL pública).
 *                           Esta key se usa para generar URLs firmadas bajo demanda.
 *                       logo_url:
 *                         type: string
 *                         nullable: true
 *                         example: "https://aki.r2.cloudflarestorage.com/companies/8781c1e4-923b-425f-851a-6f258a7b7361.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ac25cf9f04abf4e8f5b343c3f5134091%2F20260621%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260621T173128Z&X-Amz-Expires=3600&X-Amz-Signature=fb3c8f0e....d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
 *                         description: |
 *                           URL firmada temporal del logo (expira en 1 hora).
 *                           Debe ser usada para mostrar la imagen en el frontend.
 *                           Si expira, se debe solicitar una nueva URL.
 *                       descripcion:
 *                         type: string
 *                         nullable: true
 *                         example: "Descripción de mi empresa"
 *                         description: Descripción de la empresa
 *                       estado:
 *                         type: boolean
 *                         example: true
 *                         description: Estado de la empresa (activo/inactivo)
 *                       fecha_registro:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-21T17:31:28.093Z"
 *                         description: Fecha de registro de la empresa
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
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error interno del servidor"
 *                 error:
 *                   type: string
 */
router.get('/', authenticateJWT, getCompanies);

/**
 * @openapi
 * /api/companies/{id}:
 *   get:
 *     summary: Obtiene la información detallada de una empresa por su ID con URLs firmadas
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la empresa a consultar
 *         example: "10"
 *     responses:
 *       200:
 *         description: "Datos de la empresa obtenidos exitosamente con URLs firmadas para logo y posts"
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
 *                   description: Datos completos de la empresa
 *                   properties:
 *                     id_empresa:
 *                       type: integer
 *                       example: 10
 *                       description: ID único de la empresa
 *                     id_usuario:
 *                       type: integer
 *                       example: 28
 *                       description: ID del usuario propietario
 *                     id_categoria:
 *                       type: integer
 *                       nullable: true
 *                       example: 4
 *                       description: ID de la categoría de la empresa
 *                     id_estado:
 *                       type: integer
 *                       example: 4
 *                       description: ID del estado donde se encuentra la empresa
 *                     id_municipio:
 *                       type: integer
 *                       example: 39
 *                       description: ID del municipio donde se encuentra la empresa
 *                     id_ciudad:
 *                       type: integer
 *                       example: 58
 *                       description: ID de la ciudad donde se encuentra la empresa
 *                     nombre_comercial:
 *                       type: string
 *                       example: "Mi Empresa S.A."
 *                       description: Nombre comercial de la empresa
 *                     razon_social:
 *                       type: string
 *                       nullable: true
 *                       example: "Mi Empresa S.A."
 *                       description: Razón social de la empresa
 *                     rif:
 *                       type: string
 *                       nullable: true
 *                       example: "J-00000000-0"
 *                       description: RIF de la empresa
 *                     pagina_web:
 *                       type: string
 *                       nullable: true
 *                       example: "https://miempresa.com"
 *                       description: Página web de la empresa
 *                     logo:
 *                       type: string
 *                       nullable: true
 *                       example: "companies/logo/8781c1e4-923b-425f-851a-6f258a7b7361.webp"
 *                       description: Key de la imagen en R2 (no es una URL pública)
 *                     descripcion:
 *                       type: string
 *                       nullable: true
 *                       example: "Descripción de mi empresa"
 *                       description: Descripción de la empresa
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                       description: Estado de la empresa (activo/inactivo)
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-21T17:31:28.093Z"
 *                       description: Fecha de registro de la empresa
 *                     post:
 *                       type: array
 *                       description: Publicaciones de la empresa con URLs firmadas
 *                       items:
 *                         type: object
 *                         properties:
 *                           id_post:
 *                             type: integer
 *                             example: 15
 *                             description: ID de la publicación
 *                           titulo:
 *                             type: string
 *                             example: "Nuevos productos disponibles"
 *                             description: Título de la publicación
 *                           descripcion:
 *                             type: string
 *                             nullable: true
 *                             example: "Tenemos nuevos insumos médicos"
 *                             description: Descripción de la publicación
 *                           key:
 *                             type: string
 *                             example: "companies/posts/def456.webp"
 *                             description: Key de la imagen en R2
 *                           url:
 *                             type: string
 *                             example: "https://aki.r2.cloudflarestorage.com/posts/def456.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&..."
 *                             description: URL firmada temporal de la imagen (expira en 1 hora)
 *                           fecha_publicacion:
 *                             type: string
 *                             format: date-time
 *                             example: "2026-06-21T17:31:28.093Z"
 *                             description: Fecha de publicación
 *                 logo_url:
 *                   type: string
 *                   nullable: true
 *                   example: "https://aki.r2.cloudflarestorage.com/companies/8781c1e4-923b-425f-851a-6f258a7b7361.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ac25cf9f04abf4e8f5b343c3f5134091%2F20260621%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260621T173128Z&X-Amz-Expires=3600&X-Amz-Signature=fb3c8f0e....d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
 *                   description: URL firmada temporal del logo (expira en 1 hora)
 *                 imagenes:
 *                   type: array
 *                   description: URLs firmadas de todas las imágenes de las publicaciones
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_post:
 *                         type: integer
 *                         example: 15
 *                         description: ID de la publicación
 *                       key:
 *                         type: string
 *                         example: "companies/posts/def456.webp"
 *                         description: Key de la imagen en R2
 *                       url:
 *                         type: string
 *                         example: "https://aki.r2.cloudflarestorage.com/posts/def456.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&..."
 *                         description: URL firmada temporal de la imagen (expira en 1 hora)
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
 *                   example: "El ID de la empresa no es válido"
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
 *       404:
 *         description: Empresa no encontrada
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
 *                   example: "Empresa no encontrada"
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
router.get('/:id', authenticateJWT, getCompanyById);

/**
 * @openapi
 * /api/companies:
 *   post:
 *     summary: Crea una nueva empresa con logo
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_comercial
 *               - descripcion
 *               - id_usuario
 *               - id_estado
 *               - id_municipio
 *               - id_ciudad
 *               - id_categoria
 *             properties:
 *               nombre_comercial:
 *                 type: string
 *                 example: "Mi Empresa S.A."
 *                 description: Nombre comercial de la empresa
 *               razon_social:
 *                 type: string
 *                 example: "Mi Empresa S.A."
 *                 description: Razón social de la empresa (opcional)
 *               rif:
 *                 type: string
 *                 example: "J-00000000-0"
 *                 description: RIF de la empresa (opcional)
 *               pagina_web:
 *                 type: string
 *                 example: "https://miempresa.com"
 *                 description: Página web de la empresa (opcional)
 *               descripcion:
 *                 type: string
 *                 example: "Descripción de mi empresa"
 *                 description: Descripción de la empresa
 *               id_usuario:
 *                 type: string
 *                 example: "28"
 *                 description: ID del usuario propietario
 *               id_categoria:
 *                 type: string
 *                 example: "4"
 *                 description: ID de la categoría de la empresa
 *               id_estado:
 *                 type: string
 *                 example: "4"
 *                 description: ID del estado donde se encuentra la empresa
 *               id_municipio:
 *                 type: string
 *                 example: "39"
 *                 description: ID del municipio donde se encuentra la empresa
 *               id_ciudad:
 *                 type: string
 *                 example: "58"
 *                 description: ID de la ciudad donde se encuentra la empresa
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: |
 *                   Logo de la empresa (opcional).
 *                   Formatos permitidos: JPEG, PNG, WEBP, GIF.
 *                   Tamaño máximo: 5MB.
 *                   La imagen será optimizada automáticamente a 400x400px en formato WEBP.
 *     responses:
 *       201:
 *         description: Empresa creada exitosamente
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
 *                     id_empresa:
 *                       type: integer
 *                       example: 10
 *                     id_usuario:
 *                       type: integer
 *                       example: 28
 *                     id_categoria:
 *                       type: integer
 *                       example: 4
 *                     id_estado:
 *                       type: integer
 *                       example: 4
 *                     id_municipio:
 *                       type: integer
 *                       example: 39
 *                     id_ciudad:
 *                       type: integer
 *                       example: 58
 *                     nombre_comercial:
 *                       type: string
 *                       example: "Mi Empresa S.A."
 *                     razon_social:
 *                       type: string
 *                       nullable: true
 *                       example: "Mi Empresa S.A."
 *                     rif:
 *                       type: string
 *                       nullable: true
 *                       example: "J-00000000-0"
 *                     pagina_web:
 *                       type: string
 *                       nullable: true
 *                       example: "https://miempresa.com"
 *                     logo:
 *                       type: string
 *                       nullable: true
 *                       example: "companies/logo/8781c1e4-923b-425f-851a-6f258a7b7361.webp"
 *                       description: Key de la imagen en R2
 *                     logo_url:
 *                       type: string
 *                       nullable: true
 *                       example: "https://aki.r2.cloudflarestorage.com/companies/8781c1e4-923b-425f-851a-6f258a7b7361.webp?X-Amz-Algorithm=..."
 *                       description: URL firmada temporal del logo (expira en 1 hora)
 *                     descripcion:
 *                       type: string
 *                       example: "Descripción de mi empresa"
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-21T17:31:28.093Z"
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
 *                 error:
 *                   type: string
 *             examples:
 *               CamposFaltantes:
 *                 value:
 *                   success: false
 *                   message: "Faltan campos obligatorios para generar la empresa/entidad (descripcion, id_usuario, id_estado, id_municipio, id_ciudad, nombre_comercial, id_categoria)"
 *               ImagenInvalida:
 *                 value:
 *                   success: false
 *                   message: "Error al procesar el logo de la empresa"
 *                   error: "Formato de imagen no permitido. Solo se aceptan: JPEG, PNG, WEBP, GIF"
 *               ImagenMuyGrande:
 *                 value:
 *                   success: false
 *                   message: "Error al procesar el logo de la empresa"
 *                   error: "La imagen no puede exceder los 5MB"
 *       401:
 *         description: No autorizado - Se requiere token JWT válido
 *       413:
 *         description: La imagen excede el tamaño máximo permitido (5MB)
 *       415:
 *         description: Formato de imagen no permitido
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', upload.single('logo'), authenticateJWT, createCompany);

/**
 * @openapi
 * /api/companies/{id}:
 *   put:
 *     summary: Actualiza una empresa existente (incluyendo logo)
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la empresa a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_comercial:
 *                 type: string
 *                 example: "Nuevo Nombre Comercial"
 *                 description: Nombre comercial de la empresa (opcional)
 *               razon_social:
 *                 type: string
 *                 example: "Nueva Razón Social"
 *                 description: Razón social de la empresa (opcional)
 *               rif:
 *                 type: string
 *                 example: "J-99999999-9"
 *                 description: RIF de la empresa (opcional)
 *               pagina_web:
 *                 type: string
 *                 example: "https://nuevapagina.com"
 *                 description: Página web de la empresa (opcional)
 *               descripcion:
 *                 type: string
 *                 example: "Nueva descripción de la empresa"
 *                 description: Descripción de la empresa (opcional)
 *               id_categoria:
 *                 type: string
 *                 example: "5"
 *                 description: ID de la categoría de la empresa (opcional)
 *               id_estado:
 *                 type: string
 *                 example: "5"
 *                 description: ID del estado donde se encuentra la empresa (opcional)
 *               id_municipio:
 *                 type: string
 *                 example: "40"
 *                 description: ID del municipio donde se encuentra la empresa (opcional)
 *               id_ciudad:
 *                 type: string
 *                 example: "59"
 *                 description: ID de la ciudad donde se encuentra la empresa (opcional)
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: |
 *                   Nuevo logo de la empresa (opcional).
 *                   Si se envía, reemplazará automáticamente al logo actual.
 *                   El logo anterior será eliminado de R2.
 *                   Formatos permitidos: JPEG, PNG, WEBP, GIF.
 *                   Tamaño máximo: 5MB.
 *                   La imagen será optimizada automáticamente a 400x400px en formato WEBP.
 *     responses:
 *       200:
 *         description: Empresa actualizada exitosamente con nueva URL firmada
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
 *                     id_empresa:
 *                       type: integer
 *                       example: 10
 *                     id_usuario:
 *                       type: integer
 *                       example: 28
 *                     id_categoria:
 *                       type: integer
 *                       nullable: true
 *                       example: 5
 *                     id_estado:
 *                       type: integer
 *                       example: 5
 *                     id_municipio:
 *                       type: integer
 *                       example: 40
 *                     id_ciudad:
 *                       type: integer
 *                       example: 59
 *                     nombre_comercial:
 *                       type: string
 *                       example: "Nuevo Nombre Comercial"
 *                     razon_social:
 *                       type: string
 *                       nullable: true
 *                       example: "Nueva Razón Social"
 *                     rif:
 *                       type: string
 *                       nullable: true
 *                       example: "J-99999999-9"
 *                     pagina_web:
 *                       type: string
 *                       nullable: true
 *                       example: "https://nuevapagina.com"
 *                     logo:
 *                       type: string
 *                       nullable: true
 *                       example: "companies/logo/abcdef12-3456-7890-abcd-ef1234567890.webp"
 *                       description: Nueva KEY de la imagen en R2
 *                     logo_url:
 *                       type: string
 *                       nullable: true
 *                       example: "https://aki.r2.cloudflarestorage.com/companies/abcdef12-3456-7890-abcd-ef1234567890.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&..."
 *                       description: URL firmada temporal del nuevo logo (expira en 1 hora)
 *                     descripcion:
 *                       type: string
 *                       example: "Nueva descripción de la empresa"
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-21T17:31:28.093Z"
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
 *                 error:
 *                   type: string
 *             examples:
 *               IDInvalido:
 *                 value:
 *                   success: false
 *                   message: "El ID de la empresa no es válido"
 *               ImagenInvalida:
 *                 value:
 *                   success: false
 *                   message: "Error al procesar el logo de la empresa"
 *                   error: "Formato de imagen no permitido. Solo se aceptan: JPEG, PNG, WEBP, GIF"
 *               ImagenMuyGrande:
 *                 value:
 *                   success: false
 *                   message: "Error al procesar el logo de la empresa"
 *                   error: "La imagen no puede exceder los 5MB"
 *       401:
 *         description: No autorizado - Se requiere token JWT válido
 *       404:
 *         description: Empresa no encontrada
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
 *                   example: "Empresa no encontrada"
 *       413:
 *         description: La imagen excede el tamaño máximo permitido (5MB)
 *       415:
 *         description: Formato de imagen no permitido
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
router.put('/:id', upload.single('logo'), authenticateJWT, updateCompany);

/**
 * @openapi
 * /api/companies/{id}:
 *   delete:
 *     summary: Elimina (desactiva) una empresa y su logo de R2
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la empresa a eliminar
 *         example: "13"
 *     responses:
 *       200:
 *         description: Empresa desactivada exitosamente y logo eliminado de R2
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
 *                   example: "Empresa desactivada exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_empresa:
 *                       type: integer
 *                       example: 13
 *                       description: ID de la empresa eliminada
 *                     id_usuario:
 *                       type: integer
 *                       example: 28
 *                       description: ID del usuario propietario
 *                     id_categoria:
 *                       type: integer
 *                       nullable: true
 *                       example: 4
 *                       description: ID de la categoría de la empresa
 *                     id_estado:
 *                       type: integer
 *                       example: 1
 *                       description: ID del estado donde se encuentra la empresa
 *                     id_municipio:
 *                       type: integer
 *                       example: 1
 *                       description: ID del municipio donde se encuentra la empresa
 *                     id_ciudad:
 *                       type: integer
 *                       example: 1
 *                       description: ID de la ciudad donde se encuentra la empresa
 *                     nombre_comercial:
 *                       type: string
 *                       example: "Mi Empresa S.A. 2"
 *                       description: Nombre comercial de la empresa
 *                     razon_social:
 *                       type: string
 *                       nullable: true
 *                       example: "Mi Empresa S.A. 2"
 *                       description: Razón social de la empresa
 *                     rif:
 *                       type: string
 *                       nullable: true
 *                       example: "J-00000000-0 2"
 *                       description: RIF de la empresa
 *                     pagina_web:
 *                       type: string
 *                       nullable: true
 *                       example: "https://miempresa.com2"
 *                       description: Página web de la empresa
 *                     logo:
 *                       type: string
 *                       nullable: true
 *                       example: "companies/logo/e645628a-e9ff-410f-86ea-faec03eea70d.webp"
 *                       description: Key de la imagen en R2 (eliminada de R2 pero se mantiene en BD para referencia)
 *                     descripcion:
 *                       type: string
 *                       nullable: true
 *                       example: "Descripción de mi empresa2"
 *                       description: Descripción de la empresa
 *                     estado:
 *                       type: boolean
 *                       example: false
 *                       description: Estado de la empresa (false = inactiva/eliminada)
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-21T17:57:42.217Z"
 *                       description: Fecha de registro de la empresa
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
 *                   example: "El ID de la empresa no es válido"
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
 *       404:
 *         description: Empresa no encontrada o ya inactiva
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
 *                   example: "Empresa no encontrada"
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
router.delete('/:id', authenticateJWT, deleteCompany);

export default router;