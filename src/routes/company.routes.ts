import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import {
    getCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany
} from '../controllers/company.controller.js';

const router = Router();

/**
 * @openapi
 * /api/companies:
 *   get:
 *     summary: Obtiene la lista completa de empresas registradas
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Lista de empresas obtenida (success true, data companies)"
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
 *                       id_empresa:
 *                         type: integer
 *                         example: 8
 *                       id_usuario:
 *                         type: integer
 *                         example: 2
 *                       id_categoria:
 *                         type: integer
 *                         nullable: true
 *                         example: 1
 *                       id_estado:
 *                         type: integer
 *                         example: 4
 *                       id_municipio:
 *                         type: integer
 *                         example: 11
 *                       id_ciudad:
 *                         type: integer
 *                         example: 10
 *                       razon_social:
 *                         type: string
 *                         nullable: true
 *                         example: "testing"
 *                       rif:
 *                         type: string
 *                         nullable: true
 *                         example: "12345"
 *                       pagina_web:
 *                         type: string
 *                         example: "https://inversionescentro.com"
 *                       logo:
 *                         type: string
 *                         example: "https://images.com/logos/emp-045.png"
 *                       descripcion:
 *                         type: string
 *                         example: "Distribuidora mayorista de insumos médicos y farmacéuticos."
 *                       estado:
 *                         type: boolean
 *                         nullable: true
 *                         example: false
 *                       fecha_registro:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-24T17:44:21.627Z"
 *             example:
 *               success: true
 *               data:
 *                 - id_empresa: 8
 *                   id_usuario: 2
 *                   id_categoria: 1
 *                   id_estado: 4
 *                   id_municipio: 11
 *                   id_ciudad: 10
 *                   razon_social: "testing"
 *                   rif: "12345"
 *                   pagina_web: "https://inversionescentro.com"
 *                   logo: "https://images.com/logos/emp-045.png"
 *                   descripcion: "Distribuidora mayorista de insumos médicos y farmacéuticos."
 *                   estado: false
 *                   fecha_registro: "2026-05-24T17:44:21.627Z"
 *                 - id_empresa: 7
 *                   id_usuario: 2
 *                   id_categoria: null
 *                   id_estado: 4
 *                   id_municipio: 11
 *                   id_ciudad: 10
 *                   razon_social: null
 *                   rif: null
 *                   pagina_web: "https://inversionescentro.com"
 *                   logo: "https://images.com/logos/emp-045.png"
 *                   descripcion: "Distribuidora mayorista de insumos médicos y farmacéuticos."
 *                   estado: null
 *                   fecha_registro: "2026-05-24T17:37:37.276Z"
 *                 - id_empresa: 3
 *                   id_usuario: 2
 *                   id_categoria: 1
 *                   id_estado: 4
 *                   id_municipio: 11
 *                   id_ciudad: 10
 *                   razon_social: "Corporación Inversiones del Centro C.A."
 *                   rif: "J-3123456-8"
 *                   pagina_web: "https://inversionescentro.com"
 *                   logo: "https://images.com/logos/emp-045.png"
 *                   descripcion: "Distribuidora mayorista de insumos médicos y farmacéuticos."
 *                   estado: null
 *                   fecha_registro: "2026-05-24T17:36:37.354Z"
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateJWT, getCompanies);

/**
 * @openapi
 * /api/companies/{id}:
 *   get:
 *     summary: Obtiene la información detallada de una empresa por su ID
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
 *     responses:
 *       200:
 *         description: "Datos de la empresa obtenidos (success true, data company)"
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
 *                       example: 8
 *                     id_usuario:
 *                       type: integer
 *                       example: 2
 *                     id_categoria:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *                     id_estado:
 *                       type: integer
 *                       example: 4
 *                     id_municipio:
 *                       type: integer
 *                       example: 11
 *                     id_ciudad:
 *                       type: integer
 *                       example: 10
 *                     razon_social:
 *                       type: string
 *                       example: "testing"
 *                     rif:
 *                       type: string
 *                       example: "12345"
 *                     pagina_web:
 *                       type: string
 *                       example: "https://inversionescentro.com"
 *                     logo:
 *                       type: string
 *                       example: "https://images.com/logos/emp-045.png"
 *                     descripcion:
 *                       type: string
 *                       example: "Distribuidora mayorista de insumos médicos y farmacéuticos."
 *                     estado:
 *                       type: boolean
 *                       example: false
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-24T17:44:21.627Z"
 *             example:
 *               success: true
 *               data:
 *                 id_empresa: 8
 *                 id_usuario: 2
 *                 id_categoria: 1
 *                 id_estado: 4
 *                 id_municipio: 11
 *                 id_ciudad: 10
 *                 razon_social: "testing"
 *                 rif: "12345"
 *                 pagina_web: "https://inversionescentro.com"
 *                 logo: "https://images.com/logos/emp-045.png"
 *                 descripcion: "Distribuidora mayorista de insumos médicos y farmacéuticos."
 *                 estado: false
 *                 fecha_registro: "2026-05-24T17:44:21.627Z"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Empresa no encontrada
 */
router.get('/:id', authenticateJWT, getCompanyById);

/**
 * @openapi
 * /api/companies:
 *   post:
 *     summary: Registra una nueva organización o empresa en el sistema
 *     tags: [Empresas]
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
 *               - id_categoria
 *               - id_estado
 *               - id_municipio
 *               - id_ciudad
 *               - nombre_comercial
 *               - razon_social
 *               - rif
 *             properties:
 *               id_usuario:
 *                 type: string
 *                 example: "2"
 *               id_categoria:
 *                 type: string
 *                 example: "1"
 *               id_estado:
 *                 type: string
 *                 example: "4"
 *               id_municipio:
 *                 type: string
 *                 example: "11"
 *               id_ciudad:
 *                 type: string
 *                 example: "10"
 *               nombre_comercial:
 *                 type: string
 *                  example: "Corporación Inversiones"
 *               razon_social:
 *                 type: string
 *                 example: "Corporación Inversiones del Centro C.A."
 *               rif:
 *                 type: string
 *                 example: "J-31234565-8"
 *               pagina_web:
 *                 type: string
 *                 example: "https://inversionescentro.com"
 *               logo:
 *                 type: string
 *                 example: "https://images.com/logos/emp-045.png"
 *               descripcion:
 *                 type: string
 *                 example: "Distribuidora mayorista de insumos médicos y farmacéuticos."
 *           example:
 *             id_usuario: "2"
 *             id_categoria: "1"
 *             id_estado: "4"
 *             id_municipio: "11"
 *             id_ciudad: "10"
 *             nombre_comercial: "Corporación Inversiones"
 *             razon_social: "Corporación Inversiones del Centro C.A."
 *             rif: "J-31234565-8"
 *             pagina_web: "https://inversionescentro.com"
 *             logo: "https://images.com/logos/emp-045.png"
 *             descripcion: "Distribuidora mayorista de insumos médicos y farmacéuticos."
 *     responses:
 *       201:
 *         description: "Empresa registrada exitosamente (success true, data newCompany)"
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
 *                       example: 1
 *                     id_usuario:
 *                       type: integer
 *                       example: 2
 *                     id_categoria:
 *                       type: integer
 *                       example: 1
 *                     id_estado:
 *                       type: integer
 *                       example: 4
 *                     id_municipio:
 *                       type: integer
 *                       example: 11
 *                     id_ciudad:
 *                       type: integer
 *                       example: 10
 *                     nombre_comercial:
 *                       type: string
 *                       example: "Corporación Inversiones"
 *                     razon_social:
 *                       type: string
 *                       example: "Corporación Inversiones del Centro C.A."
 *                     rif:
 *                       type: string
 *                       example: "J-31234565-8"
 *                     pagina_web:
 *                       type: string
 *                       example: "https://inversionescentro.com"
 *                     logo:
 *                       type: string
 *                       example: "https://images.com/logos/emp-045.png"
 *                     descripcion:
 *                       type: string
 *                       example: "Distribuidora mayorista de insumos médicos y farmacéuticos."
 *                     estado:
 *                       type: boolean
 *                       nullable: true
 *                       example: null
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-24T17:28:38.851Z"
 *             example:
 *               success: true
 *               data:
 *                 id_empresa: 1
 *                 id_usuario: 2
 *                 id_categoria: 1
 *                 id_estado: 4
 *                 id_municipio: 11
 *                 id_ciudad: 10
 *                 nombre_comercial: "Corporación Inversiones"
 *                 razon_social: "Corporación Inversiones del Centro C.A."
 *                 rif: "J-31234565-8"
 *                 pagina_web: "https://inversionescentro.com"
 *                 logo: "https://images.com/logos/emp-045.png"
 *                 descripcion: "Distribuidora mayorista de insumos médicos y farmacéuticos."
 *                 estado: true
 *                 fecha_registro: "2026-05-24T17:28:38.851Z"
 *       400:
 *         description: "Faltan campos obligatorios para generar la empresa/entidad (descripcion, id_usuario, id_estado, id_municipio, id_ciudad)"
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
 *                   example: "Faltan campos obligatorios para generar la empresa/entidad (descripcion, id_usuario, id_estado, id_municipio, id_ciudad)"
 *             example:
 *               success: false
 *               message: "Faltan campos obligatorios para generar la empresa/entidad (descripcion, id_usuario, id_estado, id_municipio, id_ciudad)"
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateJWT, createCompany);

/**
 * @openapi
 * /api/companies/{id}:
 *   put:
 *     summary: Modifica los parámetros comerciales o de ubicación geográfica de una empresa
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: string
 *                 example: "2"
 *               id_categoria:
 *                 type: string
 *                 example: "1"
 *               id_estado:
 *                 type: string
 *                 example: "4"
 *               id_municipio:
 *                 type: string
 *                 example: "11"
 *               id_ciudad:
 *                 type: string
 *                 example: "10"
 *               nombre_comercial:
 *                 type: string
 *                 example: "Corporación Inversiones"
 *               razon_social:
 *                 type: string
 *                 example: "testing"
 *               rif:
 *                 type: string
 *                 example: "12345"
 *               pagina_web:
 *                 type: string
 *                 example: "https://inversionescentro.com"
 *               logo:
 *                 type: string
 *                 example: "https://images.com/logos/emp-045.png"
 *               descripcion:
 *                 type: string
 *                 example: "Distribuidora mayorista de insumos médicos y farmacéuticos."
 *           example:
 *             id_usuario: "2"
 *             id_categoria: "1"
 *             id_estado: "4"
 *             id_municipio: "11"
 *             id_ciudad: "10"
 *             nombre_comercial: "Corporación Inversiones"
 *             razon_social: "testing"
 *             rif: "12345"
 *             pagina_web: "https://inversionescentro.com"
 *             logo: "https://images.com/logos/emp-045.png"
 *             descripcion: "Distribuidora mayorista de insumos médicos y farmacéuticos."
 *     responses:
 *       200:
 *         description: "Empresa actualizada exitosamente (success true, data updatedCompany)"
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
 *                       example: 8
 *                     id_usuario:
 *                       type: integer
 *                       example: 2
 *                     id_categoria:
 *                       type: integer
 *                       example: 1
 *                     id_estado:
 *                       type: integer
 *                       example: 4
 *                     id_municipio:
 *                       type: integer
 *                       example: 11
 *                     id_ciudad:
 *                       type: integer
 *                       example: 10
 *                     nombre_comercial:
 *                       type: string
 *                       example: "Corporación Inversiones"
 *                     razon_social:
 *                       type: string
 *                       example: "testing"
 *                     rif:
 *                       type: string
 *                       example: "12345"
 *                     pagina_web:
 *                       type: string
 *                       example: "https://inversionescentro.com"
 *                     logo:
 *                       type: string
 *                       example: "https://images.com/logos/emp-045.png"
 *                     descripcion:
 *                       type: string
 *                       example: "Distribuidora mayorista de insumos médicos y farmacéuticos."
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-24T17:44:21.627Z"
 *             example:
 *               success: true
 *               data:
 *                 id_empresa: 8
 *                 id_usuario: 2
 *                 id_categoria: 1
 *                 id_estado: 4
 *                 id_municipio: 11
 *                 id_ciudad: 10
 *                 nombre_comercial: "Corporación Inversiones"
 *                 razon_social: "testing"
 *                 rif: "12345"
 *                 pagina_web: "https://inversionescentro.com"
 *                 logo: "https://images.com/logos/emp-045.png"
 *                 descripcion: "Distribuidora mayorista de insumos médicos y farmacéuticos."
 *                 estado: true
 *                 fecha_registro: "2026-05-24T17:44:21.627Z"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Empresa no encontrada
 */
router.put('/:id', authenticateJWT, updateCompany);

/**
 * @openapi
 * /api/companies/{id}:
 *   delete:
 *     summary: Ejecuta la baja lógica de una empresa desactivando su visualización
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la empresa a desactivar
 *     responses:
 *       200:
 *         description: Empresa desactivada correctamente de la plataforma
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
 *                       example: 8
 *                     id_usuario:
 *                       type: integer
 *                       example: 2
 *                     id_categoria:
 *                       type: integer
 *                       example: 1
 *                     id_estado:
 *                       type: integer
 *                       example: 4
 *                     id_municipio:
 *                       type: integer
 *                       example: 11
 *                     id_ciudad:
 *                       type: integer
 *                       example: 10
 *                     nombre_comercial:
 *                       type: string
 *                       example: "Corporación Inversiones"
 *                     razon_social:
 *                       type: string
 *                       example: "testing"
 *                     rif:
 *                       type: string
 *                       example: "12345"
 *                     pagina_web:
 *                       type: string
 *                       example: "https://inversionescentro.com"
 *                     logo:
 *                       type: string
 *                       example: "https://images.com/logos/emp-045.png"
 *                     descripcion:
 *                       type: string
 *                       example: "Distribuidora mayorista de insumos médicos y farmacéuticos."
 *                     estado:
 *                       type: boolean
 *                       example: false
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-24T17:44:21.627Z"
 *             example:
 *               success: true
 *               message: "Empresa desactivada exitosamente"
 *               data:
 *                 id_empresa: 8
 *                 id_usuario: 2
 *                 id_categoria: 1
 *                 id_estado: 4
 *                 id_municipio: 11
 *                 id_ciudad: 10
 *                 nombre_comercial: Corporación Inversiones
 *                 razon_social: "testing"
 *                 rif: "12345"
 *                 pagina_web: "https://inversionescentro.com"
 *                 logo: "https://images.com/logos/emp-045.png"
 *                 descripcion: "Distribuidora mayorista de insumos médicos y farmacéuticos."
 *                 estado: false
 *                 fecha_registro: "2026-05-24T17:44:21.627Z"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Empresa no encontrada o inactiva previa
 */
router.delete('/:id', authenticateJWT, deleteCompany);

export default router;