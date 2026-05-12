import { Router } from 'express';
import * as ProductController from '../controllers/product.controller.js';
import { authenticateJWT } from '../middlewares/auth.handler.js';

const router = Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Obtiene el catálogo completo de productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_product:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   stock:
 *                     type: integer
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', ProductController.getProducts);

/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *               - category_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Laptop Dell XPS"
 *               description:
 *                 type: string
 *                 example: "Procesador i7, 16GB RAM, 512GB SSD"
 *               price:
 *                 type: number
 *                 example: 1200.50
 *               stock:
 *                 type: integer
 *                 example: 15
 *               category_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       401:
 *         description: No autorizado - Token faltante o inválido
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post('/', authenticateJWT, ProductController.createProduct);

export default router;