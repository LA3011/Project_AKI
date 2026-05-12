import { Router } from 'express';
import { getUsers } from '../controllers/user.controller.js';
import { login, refreshToken, register } from '../controllers/auth.controller.js';
import { authenticateJWT } from '../middlewares/auth.handler.js';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Obtiene la lista de usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateJWT, getUsers);

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     summary: Registra un nuevo usuario (+token) en el sistema
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan"
 *               lastName:
 *                 type: string
 *                 example: "Pérez"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan.perez@aki.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *               role:
 *                 type: string
 *                 default: "user"
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: El correo electrónico ya está registrado
 *       500:
 *         description: Error interno
 */
router.post('/register', register);

/**
 * @openapi
 * /api/users/login:
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
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', login);

/**
 * @openapi
 * /api/users/refresh-token:
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
 *       403:
 *         description: Refresh token inválido
 */
router.post('/refresh-token', refreshToken);

export default router;