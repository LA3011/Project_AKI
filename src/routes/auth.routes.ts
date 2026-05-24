import { Router } from 'express';
import { authRateLimit } from '../middlewares/rateLimit.handler.js';
import { login, refreshToken, register } from '../controllers/auth.controller.js';

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
router.post('/register', authRateLimit, register);

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
 *               - correo
 *               - password
 *             properties:
 *               correo:
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

export default router;