import { Router } from 'express';
import { getCities, getMunicipalities, getStates } from '../controllers/locate.controller.js';

const router = Router();

/**
 * @openapi
 * /api/state:
 *   get:
 *     summary: Obtiene la lista de estados con sus municipios y ciudades asociadas
 *     tags: [Localidad]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Filtrar por el ID único del estado
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Búsqueda parcial por nombre del estado (ILIKE)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [id, name, code]
 *         description: Campo por el cual ordenar el resultado
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC, asc, desc]
 *         description: Dirección del ordenamiento
 *     responses:
 *       200:
 *         description: Lista de estados obtenida exitosamente con su árbol jerárquico.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 4
 *                   name:
 *                     type: string
 *                     example: "Aragua"
 *                   code:
 *                     type: string
 *                     example: "AR"
 *                   status:
 *                     type: boolean
 *                     example: true
 *                   municipalities:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 36
 *                         name:
 *                           type: string
 *                           example: "Bolívar"
 *                         status:
 *                           type: boolean
 *                           example: true
 *                         cities:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 54
 *                               name:
 *                                 type: string
 *                                 example: "San Mateo"
 *                               status:
 *                                 type: boolean
 *                                 example: true
 *                 example:
 *                   - id: 4
 *                     name: "Aragua"
 *                     code: "AR"
 *                     status: true
 *                     municipalities:
 *                       - id: 36
 *                         name: "Bolívar"
 *                         status: true
 *                         cities:
 *                           - id: 54
 *                             name: "San Mateo"
 *                             status: true
 *                       - id: 39
 *                         name: "Girardot"
 *                         status: true
 *                         cities:
 *                           - id: 58
 *                             name: "Maracay"
 *                             status: true
 *                           - id: 59
 *                             name: "Choroní"
 *                             status: true
 */
router.get('/state', getStates);

/**
 * @openapi
 * /api/cities:
 *   get:
 *     summary: Obtiene la lista de ciudades con sus detalles de municipio y estado
 *     tags: [Localidad]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Filtrar por el ID único de la ciudad
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Búsqueda parcial por nombre de la ciudad (ILIKE)
 *       - in: query
 *         name: stateId
 *         schema:
 *           type: string
 *         description: Filtrar ciudades pertenecientes a un ID de estado específico
 *       - in: query
 *         name: stateName
 *         schema:
 *           type: string
 *         description: Búsqueda de ciudades mediante el nombre de su estado
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [id, name]
 *         description: Campo por el cual ordenar el resultado
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC, asc, desc]
 *         description: Dirección del ordenamiento
 *     responses:
 *       200:
 *         description: Lista de ciudades obtenida exitosamente con sus relaciones directas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 75
 *                   name:
 *                     type: string
 *                     example: "Cagua"
 *                   status:
 *                     type: boolean
 *                     example: true
 *                   municipality:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 50
 *                       name:
 *                         type: string
 *                         example: "Sucre"
 *                       status:
 *                         type: boolean
 *                         example: true
 *                   state:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 4
 *                       name:
 *                         type: string
 *                         example: "Aragua"
 *                       status:
 *                         type: boolean
 *                         example: true
 *                 example:
 *                   - id: 217
 *                     name: "Aricagua"
 *                     status: true
 *                     municipality:
 *                       id: 157
 *                       name: "Aricagua"
 *                       status: true
 *                     state:
 *                       id: 14
 *                       name: "Mérida"
 *                       status: true
 *                   - id: 75
 *                     name: "Cagua"
 *                     status: true
 *                     municipality:
 *                       id: 50
 *                       name: "Sucre"
 *                       status: true
 *                     state:
 *                       id: 4
 *                       name: "Aragua"
 *                       status: true
 */
router.get('/cities', getCities);

/**
 * @openapi
 * /api/municipalities:
 *   get:
 *     summary: Obtiene la lista de municipios con su estado y ciudades asociadas
 *     tags: [Localidad]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Filtrar por el ID único del municipio
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Búsqueda parcial por nombre del municipio (ILIKE)
 *       - in: query
 *         name: cityId
 *         schema:
 *           type: string
 *         description: Filtrar municipios vinculados a un ID de ciudad específico
 *       - in: query
 *         name: cityName
 *         schema:
 *           type: string
 *         description: Búsqueda de municipios mediante el nombre de una de sus ciudades
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [id, name]
 *         description: Campo por el cual ordenar el resultado
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC, asc, desc]
 *         description: Dirección del ordenamiento
 *     responses:
 *       200:
 *         description: Lista de municipios obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 177
 *                   name:
 *                     type: string
 *                     example: "Acevedo"
 *                   status:
 *                     type: boolean
 *                     example: true
 *                   state:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 15
 *                       name:
 *                         type: string
 *                         example: "Miranda"
 *                       status:
 *                         type: boolean
 *                         example: true
 *                   cities:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 237
 *                         name:
 *                           type: string
 *                           example: "Caucagua"
 *                         status:
 *                           type: boolean
 *                           example: true
 *                 example:
 *                   - id: 177
 *                     name: "Acevedo"
 *                     status: true
 *                     state:
 *                       id: 15
 *                       name: "Miranda"
 *                       status: true
 *                     cities:
 *                       - id: 237
 *                         name: "Caucagua"
 *                         status: true
 *                   - id: 29
 *                     name: "Achaguas"
 *                     status: true
 *                     state:
 *                       id: 3
 *                       name: "Apure"
 *                       status: true
 *                     cities:
 *                       - id: 40
 *                         name: "Achaguas"
 *                         status: true
 *                       - id: 41
 *                         name: "Apurito"
 *                         status: true
 */
router.get('/municipalities', getMunicipalities);

export default router;