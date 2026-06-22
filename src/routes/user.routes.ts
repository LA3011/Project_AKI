import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import { getUsers, getUserById, deleteUser, updateUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios con URLs firmadas para sus fotos de perfil
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
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
 *                       id_usuario:
 *                         type: integer
 *                         example: 29
 *                       tipo_usuario:
 *                         type: string
 *                         example: "Cliente"
 *                         enum: [Cliente, Comercio Estándar, Comercio Premium, Supervisor de Soporte, Super Administrador]
 *                       id_estado:
 *                         type: integer
 *                         nullable: true
 *                         example: 1
 *                       id_municipio:
 *                         type: integer
 *                         nullable: true
 *                         example: 1
 *                       id_ciudad:
 *                         type: integer
 *                         nullable: true
 *                         example: 1
 *                       nombres:
 *                         type: string
 *                         example: "test"
 *                       apellidos:
 *                         type: string
 *                         example: "test"
 *                       correo:
 *                         type: string
 *                         format: email
 *                         example: "test@gmail.com"
 *                       telefono:
 *                         type: string
 *                         nullable: true
 *                         example: "041212345679"
 *                       foto_perfil:
 *                         type: string
 *                         nullable: true
 *                         example: "profiles/59679146-c83b-476e-82e6-d52d213795b7.webp"
 *                         description: Key de la imagen en R2 (null si no tiene foto)
 *                       foto_perfil_url:
 *                         type: string
 *                         nullable: true
 *                         example: "https://aki.r2.cloudflarestorage.com/profiles/59679146-c83b-476e-82e6-d52d213795b7.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&..."
 *                         description: URL firmada temporal de la foto (expira en 1 hora, null si no tiene foto)
 *                       ultimo_login:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: null
 *                       verificado:
 *                         type: boolean
 *                         nullable: true
 *                         example: null
 *                       estado:
 *                         type: boolean
 *                         example: false
 *                         description: Estado del usuario (true = activo, false = inactivo)
 *                       fecha_registro:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-21T23:58:48.492Z"
 *             example:
 *               success: true
 *               data:
 *                 - id_usuario: 29
 *                   tipo_usuario: "Cliente"
 *                   id_estado: 1
 *                   id_municipio: 1
 *                   id_ciudad: 1
 *                   nombres: "test"
 *                   apellidos: "test"
 *                   correo: "test@gmail.com"
 *                   telefono: "041212345679"
 *                   foto_perfil: "profiles/59679146-c83b-476e-82e6-d52d213795b7.webp"
 *                   foto_perfil_url: "https://aki.r2.cloudflarestorage.com/profiles/59679146-c83b-476e-82e6-d52d213795b7.webp?X-Amz-Algorithm=..."
 *                   ultimo_login: null
 *                   verificado: null
 *                   estado: false
 *                   fecha_registro: "2026-06-21T23:58:48.492Z"
 *       401:
 *         description: No autorizado - Se requiere token JWT válido
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', authenticateJWT, getUsers);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID con URL firmada para su foto de perfil
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a consultar
 *         example: "29"
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
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
 *                     id_usuario:
 *                       type: integer
 *                       example: 29
 *                     tipo_usuario:
 *                       type: string
 *                       example: "Cliente"
 *                     id_estado:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *                     id_municipio:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *                     id_ciudad:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *                     nombres:
 *                       type: string
 *                       example: "test"
 *                     apellidos:
 *                       type: string
 *                       example: "test"
 *                     correo:
 *                       type: string
 *                       format: email
 *                       example: "test@gmail.com"
 *                     telefono:
 *                       type: string
 *                       nullable: true
 *                       example: "041212345679"
 *                     foto_perfil:
 *                       type: string
 *                       nullable: true
 *                       example: "profiles/59679146-c83b-476e-82e6-d52d213795b7.webp"
 *                       description: Key de la imagen en R2 (null si no tiene foto)
 *                     foto_perfil_url:
 *                       type: string
 *                       nullable: true
 *                       example: "https://aki.r2.cloudflarestorage.com/profiles/59679146-c83b-476e-82e6-d52d213795b7.webp?X-Amz-Algorithm=..."
 *                       description: URL firmada temporal de la foto (expira en 1 hora)
 *                     ultimo_login:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
 *                     verificado:
 *                       type: boolean
 *                       nullable: true
 *                       example: null
 *                     estado:
 *                       type: boolean
 *                       example: false
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-21T23:58:48.492Z"
 *             example:
 *               success: true
 *               data:
 *                 id_usuario: 29
 *                 tipo_usuario: "Cliente"
 *                 id_estado: 1
 *                 id_municipio: 1
 *                 id_ciudad: 1
 *                 nombres: "test"
 *                 apellidos: "test"
 *                 correo: "test@gmail.com"
 *                 telefono: "041212345679"
 *                 foto_perfil: "profiles/59679146-c83b-476e-82e6-d52d213795b7.webp"
 *                 foto_perfil_url: "https://aki.r2.cloudflarestorage.com/profiles/59679146-c83b-476e-82e6-d52d213795b7.webp?X-Amz-Algorithm=..."
 *                 ultimo_login: null
 *                 verificado: null
 *                 estado: false
 *                 fecha_registro: "2026-06-21T23:58:48.492Z"
 *       400:
 *         description: ID proporcionado no es válido
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
 *                   example: "El ID proporcionado no es válido"
 *       401:
 *         description: No autorizado - Se requiere token JWT válido
 *       404:
 *         description: Usuario no encontrado
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
 *                   example: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', authenticateJWT, getUserById);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Actualiza un usuario (incluyendo foto de perfil)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *         example: "29"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombres:
 *                 type: string
 *                 example: "Juan Carlos"
 *                 description: Nombre(s) del usuario (opcional)
 *               apellidos:
 *                 type: string
 *                 example: "Pérez Gómez"
 *                 description: Apellido(s) del usuario (opcional)
 *               telefono:
 *                 type: string
 *                 example: "04121234567"
 *                 description: Teléfono del usuario (opcional)
 *               id_estado:
 *                 type: string
 *                 example: "4"
 *                 description: ID del estado (opcional)
 *               id_municipio:
 *                 type: string
 *                 example: "11"
 *                 description: ID del municipio (opcional)
 *               id_ciudad:
 *                 type: string
 *                 example: "10"
 *                 description: ID de la ciudad (opcional)
 *               foto_perfil:
 *                 type: string
 *                 format: binary
 *                 description: |
 *                   Nueva foto de perfil (opcional).
 *                   Si se envía, reemplazará a la foto actual.
 *                   La foto anterior será eliminada de R2.
 *                   Formatos permitidos: JPEG, PNG, WEBP, GIF.
 *                   Tamaño máximo: 5MB.
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente con nueva URL firmada
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
 *                     id_usuario:
 *                       type: integer
 *                       example: 29
 *                     tipo_usuario:
 *                       type: string
 *                       example: "Cliente"
 *                     id_estado:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *                     id_municipio:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *                     id_ciudad:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *                     nombres:
 *                       type: string
 *                       example: "test"
 *                     apellidos:
 *                       type: string
 *                       example: "test"
 *                     correo:
 *                       type: string
 *                       format: email
 *                       example: "test@gmail.com"
 *                     telefono:
 *                       type: string
 *                       nullable: true
 *                       example: "041212345679"
 *                     foto_perfil:
 *                       type: string
 *                       nullable: true
 *                       example: "profiles/856fac89-f4e7-4a05-90e4-8b01b05f2244.webp"
 *                       description: Nueva KEY de la imagen en R2
 *                     foto_perfil_url:
 *                       type: string
 *                       nullable: true
 *                       example: "https://aki.r2.cloudflarestorage.com/profiles/856fac89-f4e7-4a05-90e4-8b01b05f2244.webp?X-Amz-Algorithm=..."
 *                       description: URL firmada temporal de la nueva foto
 *                     ultimo_login:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
 *                     verificado:
 *                       type: boolean
 *                       nullable: true
 *                       example: null
 *                     estado:
 *                       type: boolean
 *                       example: true
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-21T23:58:48.492Z"
 *             example:
 *               success: true
 *               data:
 *                 id_usuario: 29
 *                 tipo_usuario: "Cliente"
 *                 id_estado: 1
 *                 id_municipio: 1
 *                 id_ciudad: 1
 *                 nombres: "test"
 *                 apellidos: "test"
 *                 correo: "test@gmail.com"
 *                 telefono: "041212345679"
 *                 foto_perfil: "profiles/856fac89-f4e7-4a05-90e4-8b01b05f2244.webp"
 *                 foto_perfil_url: "https://aki.r2.cloudflarestorage.com/profiles/856fac89-f4e7-4a05-90e4-8b01b05f2244.webp?X-Amz-Algorithm=..."
 *                 ultimo_login: null
 *                 verificado: null
 *                 estado: true
 *                 fecha_registro: "2026-06-21T23:58:48.492Z"
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
 *         description: Usuario no encontrado
 *       413:
 *         description: La imagen excede el tamaño máximo permitido (5MB)
 *       415:
 *         description: Formato de imagen no permitido
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', upload.single('foto_perfil'), authenticateJWT, updateUser);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Elimina (desactiva) un usuario y su foto de perfil de R2
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *         example: "29"
 *     responses:
 *       200:
 *         description: Usuario desactivado exitosamente y foto eliminada de R2
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
 *                   example: "Usuario desactivado exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_usuario:
 *                       type: integer
 *                       example: 29
 *                     tipo_usuario:
 *                       type: string
 *                       example: "Cliente"
 *                     id_estado:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *                     id_municipio:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *                     id_ciudad:
 *                       type: integer
 *                       nullable: true
 *                       example: 1
 *                     nombres:
 *                       type: string
 *                       example: "test"
 *                     apellidos:
 *                       type: string
 *                       example: "test"
 *                     correo:
 *                       type: string
 *                       format: email
 *                       example: "test@gmail.com"
 *                     telefono:
 *                       type: string
 *                       nullable: true
 *                       example: "041212345679"
 *                     foto_perfil:
 *                       type: string
 *                       nullable: true
 *                       example: "profiles/856fac89-f4e7-4a05-90e4-8b01b05f2244.webp"
 *                       description: Key de la imagen (eliminada de R2 pero se mantiene en BD para referencia)
 *                     ultimo_login:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
 *                     verificado:
 *                       type: boolean
 *                       nullable: true
 *                       example: null
 *                     estado:
 *                       type: boolean
 *                       example: false
 *                     fecha_registro:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-21T23:58:48.492Z"
 *             example:
 *               success: true
 *               message: "Usuario desactivado exitosamente"
 *               data:
 *                 id_usuario: 29
 *                 tipo_usuario: "Cliente"
 *                 id_estado: 1
 *                 id_municipio: 1
 *                 id_ciudad: 1
 *                 nombres: "test"
 *                 apellidos: "test"
 *                 correo: "test@gmail.com"
 *                 telefono: "041212345679"
 *                 foto_perfil: "profiles/856fac89-f4e7-4a05-90e4-8b01b05f2244.webp"
 *                 ultimo_login: null
 *                 verificado: null
 *                 estado: false
 *                 fecha_registro: "2026-06-21T23:58:48.492Z"
 *       400:
 *         description: ID proporcionado no es válido
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
 *                   example: "El ID proporcionado no es válido"
 *       401:
 *         description: No autorizado - Se requiere token JWT válido
 *       404:
 *         description: Usuario no encontrado o ya inactivo
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
 *                   example: "Usuario no encontrado o ya inactivo"
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', authenticateJWT, deleteUser);

export default router;