import { Router } from 'express';
import { authRateLimit } from '../middlewares/rateLimit.handler.js';
import { forgotPassword, login, refreshToken, register, resetPassword } from '../controllers/auth.controller.js';
import { authenticateJWT } from '../middlewares/auth.handler.js';

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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombres
 *               - apellidos
 *               - correo
 *               - password
 *             properties:
 *               nombres:
 *                 type: string
 *                 example: "Juan"
 *               apellidos:
 *                 type: string
 *                 example: "Pérez"
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "juan.perez@aki.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *               tipo_usuario:
 *                 type: string
 *                 default: "user"
 *                 example: "user"
 *               id_estado:
 *                 type: string
 *                 example: "4"
 *               id_municipio:
 *                 type: string
 *                 example: "11"
 *               id_ciudad:
 *                 type: string
 *                 example: "10"
 *               telefono:
 *                 type: string
 *                 example: "04121234567"
 *               foto_perfil:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     correo:
 *                       type: string
 *                     tipo_usuario:
 *                       type: string
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *             example:
 *               message: "Usuario creado exitosamente"
 *               user:
 *                 id: 1
 *                 correo: "juan.perez@aki.com"
 *                 tipo_usuario: "user"
 *               token: "<token>"
 *               refreshToken: "<token>"
 *       400:
 *         description: El correo electrónico ya está registrado
 *       500:
 *         description: Error interno { message, error }
 */
router.post('/register', authRateLimit, authenticateJWT, register);
 
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