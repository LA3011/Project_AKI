import { Router } from 'express';
import { authRateLimit } from '../middlewares/rateLimit.handler.js';
import { forgotPassword, login, refreshToken, register, resetPassword } from '../controllers/auth.controller.js';
import { uploadSingle } from '../middlewares/upload.middleware.js';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario en el sistema
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombres
 *               - apellidos
 *               - correo
 *               - password
 *               - id_estado
 *               - id_municipio
 *               - id_ciudad
 *               - telefono
 *             properties:
 *               nombres:
 *                 type: string
 *                 example: "Juan"
 *                 description: Nombre(s) del usuario
 *               apellidos:
 *                 type: string
 *                 example: "Pérez"
 *                 description: Apellido(s) del usuario
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "juan.perez@aki.com"
 *                 description: Correo electrónico del usuario (debe ser único)
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *                 description: Contraseña del usuario (mínimo 8 caracteres)
 *               tipo_usuario:
 *                 type: string
 *                 default: "Cliente"
 *                 enum: [Cliente, Comercio Estándar, Testing, Supervisor de Soporte]
 *                 example: "Cliente"
 *                 description: Tipo de usuario
 *               id_estado:
 *                 type: string
 *                 example: "4"
 *                 description: ID del estado donde reside el usuario
 *               id_municipio:
 *                 type: string
 *                 example: "11"
 *                 description: ID del municipio donde reside el usuario
 *               id_ciudad:
 *                 type: string
 *                 example: "10"
 *                 description: ID de la ciudad donde reside el usuario
 *               telefono:
 *                 type: string
 *                 example: "04121234567"
 *                 description: Número de teléfono del usuario
 *               foto_perfil:
 *                 type: string
 *                 format: binary
 *                 description: |
 *                   Imagen de perfil del usuario (opcional).
 *                   Formatos permitidos: JPEG, PNG, WEBP, GIF.
 *                   Tamaño máximo: 5MB.
 *                   La imagen será optimizada automáticamente a 400x400px en formato WEBP.
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario creado exitosamente"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     correo:
 *                       type: string
 *                       example: "juan.perez@aki.com"
 *                     tipo_usuario:
 *                       type: string
 *                       example: "Cliente"
 *                     foto_perfil:
 *                       type: string
 *                       nullable: true
 *                       example: "profiles/a1b2c3d4-e5f6-7890-abcd-ef1234567890.webp"
 *                       description: |
 *                         KEY de la imagen en R2 (no es una URL pública).
 *                         Esta key se usa para generar URLs firmadas bajo demanda.
 *                     foto_perfil_url:
 *                       type: string
 *                       nullable: true
 *                       example: "https://aki.r2.cloudflarestorage.com/profiles/a1b2c3d4-e5f6-7890-abcd-ef1234567890.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ac25cf9f04abf4e8f5b343c3f5134091%2F20260621%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260621T173128Z&X-Amz-Expires=3600&X-Amz-Signature=fb3c8f0e....d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
 *                       description: |
 *                         URL firmada temporal de la foto de perfil.
 *                         Tiempo de expiración configurable via R2_TIME_EXPIRE_IMAGE.
 *                         Por defecto: 3600 segundos (1 hora).
 *                         Si la URL expira, se debe generar una nueva con GET /api/image/:key
 *                 token:
 *                   type: string
 *                   description: JWT token de acceso
 *                 refreshToken:
 *                   type: string
 *                   description: JWT token de refresco
 *             example:
 *               message: "Usuario creado exitosamente"
 *               user:
 *                 id: 1
 *                 correo: "juan.perez@aki.com"
 *                 tipo_usuario: "Cliente"
 *                 foto_perfil: "profiles/a1b2c3d4-e5f6-7890-abcd-ef1234567890.webp"
 *                 foto_perfil_url: "https://aki.r2.cloudflarestorage.com/profiles/a1b2c3d4-e5f6-7890-abcd-ef1234567890.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&..."
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *             examples:
 *               CorreoExistente:
 *                 value:
 *                   message: "El correo electrónico ya está registrado"
 *               ImagenInvalida:
 *                 value:
 *                   message: "Error al procesar la imagen de perfil"
 *                   error: "Formato de imagen no permitido. Solo se aceptan: JPEG, PNG, WEBP, GIF"
 *               ImagenMuyGrande:
 *                 value:
 *                   message: "La imagen no puede exceder los 5MB"
 *       413:
 *         description: La imagen excede el tamaño máximo permitido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *                 message:
 *                   type: string
 *                   example: "Error al registrar el usuario"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.post('/register', uploadSingle('foto_perfil'), authRateLimit, register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión y obtiene tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: luisrlvas@gmail.com
 *               password:
 *                 type: string
 *                 example: luis
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *             example:
 *               message: "Login exitoso"
 *               token: "<token>"
 *               refreshToken: "<token>"
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', authRateLimit, login);

/**
 * @openapi
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresca el token de acceso
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nuevo token generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *             example:
 *               token: "<token>"
 *       403:
 *         description: Token inválido { message, error }
 */
router.post('/refresh-token', refreshToken);

/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicita la recuperación de contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@correo.com
 *     responses:
 *       200:
 *         description: Respuesta exitosa de protección (evita enumeración de correos)
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
 *                   example: "Si el correo está registrado, se enviará un enlace de recuperación."
 *       400:
 *         description: El correo electrónico no fue proporcionado
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
 *                   example: "El correo electrónico es requerido."
 *       500:
 *         description: Error interno en el servidor
 */
router.post('/forgot-password', forgotPassword)

/**
 * @openapi
 * /api/auth/reset-password:
 *   post:
 *     summary: Restablece la contraseña utilizando un token de validación
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: false
 *         schema:
 *           type: string
 *         description: Token de recuperación (alternativa a enviarlo en el body)
 *         example: "<token>"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token de recuperación (puede enviarse aquí o como query string)
 *                 example: "<token>"
 *               newPassword:
 *                 type: string
 *                 description: La nueva contraseña para la cuenta
 *                 example: "NuevaClaveLA"
 *     responses:
 *       200:
 *         description: Contraseña restablecida con éxito
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
 *                   example: "Tu contraseña ha sido restablecida con éxito. Ya puedes iniciar sesión."
 *       400:
 *         description: Error en la validación de los datos o token inválido/expirado
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
 *                   example: "El enlace de recuperación es inválido o ya fue utilizado."
 *             example:
 *               success: false
 *               message: "El enlace de recuperación es inválido o ya fue utilizado."
 *       500:
 *         description: Error interno en el servidor
 */
router.post('/reset-password', resetPassword)


export default router;