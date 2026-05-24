import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.handler.js';
import {
    getPayments,
    getPaymentById,
    getPaymentsByMembership,
    createPayment,
    updatePayment,
    deletePayment
} from '../controllers/membershipPayments.controller.js';

const router = Router();

/**
 * @openapi
 * /api/membership-payments:
 *   get:
 *     summary: Obtiene la lista completa de cobros y pagos de membresías procesados
 *     tags: [Pagos de Membresías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Historial transaccional recuperado correctamente (success true, data payments)"
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
 *                       id_pago:
 *                         type: integer
 *                         example: 2
 *                       id_empresa_membresia:
 *                         type: integer
 *                         example: 3
 *                       referencia_pago:
 *                         type: string
 *                         example: "REF-TRANS-44021"
 *                       paypal_transaction_id:
 *                         type: string
 *                         example: "TXN77291045X"
 *                       payer_email:
 *                         type: string
 *                         example: "finance-corp@empresa.com"
 *                       monto:
 *                         type: string
 *                         example: "149.99"
 *                       moneda:
 *                         type: string
 *                         example: "USD"
 *                       estado_pago:
 *                         type: string
 *                         example: "APROBADO"
 *                       metodo_pago:
 *                         type: string
 *                         example: "PayPal"
 *                       respuesta_paypal:
 *                         type: string
 *                         example: "{\"status\":\"COMPLETED\",\"intent\":\"CAPTURE\"}"
 *                       fecha_pago:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-23T21:30:00.000Z"
 *             example:
 *               success: true
 *               data:
 *                 - id_pago: 2
 *                   id_empresa_membresia: 3
 *                   referencia_pago: "REF-TRANS-44021"
 *                   paypal_transaction_id: "TXN77291045X"
 *                   payer_email: "finance-corp@empresa.com"
 *                   monto: "149.99"
 *                   moneda: "USD"
 *                   estado_pago: "APROBADO"
 *                   metodo_pago: "PayPal"
 *                   respuesta_paypal: "{\"status\":\"COMPLETED\",\"intent\":\"CAPTURE\"}"
 *                   fecha_pago: "2026-05-23T21:30:00.000Z"
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticateJWT, getPayments);

/**
 * @openapi
 * /api/membership-payments/{id}:
 *   get:
 *     summary: Recupera la auditoría de un pago específico a través de su ID único
 *     tags: [Pagos de Membresías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pago a consultar
 *     responses:
 *       200:
 *         description: "Información del pago obtenida de manera satisfactoria (success true, data payment)"
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
 *                     id_pago:
 *                       type: integer
 *                       example: 2
 *                     id_empresa_membresia:
 *                       type: integer
 *                       example: 3
 *                     referencia_pago:
 *                       type: string
 *                       example: "REF-TRANS-44021"
 *                     paypal_transaction_id:
 *                       type: string
 *                       example: "TXN77291045X"
 *                     payer_email:
 *                       type: string
 *                       example: "finance-corp@empresa.com"
 *                     monto:
 *                       type: string
 *                       example: "149.99"
 *                     moneda:
 *                       type: string
 *                       example: "USD"
 *                     estado_pago:
 *                       type: string
 *                       example: "APROBADO"
 *                     metodo_pago:
 *                       type: string
 *                       example: "PayPal"
 *                     respuesta_paypal:
 *                       type: string
 *                       example: "{\"status\":\"COMPLETED\",\"intent\":\"CAPTURE\"}"
 *                     fecha_pago:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-23T21:30:00.000Z"
 *             example:
 *               success: true
 *               data:
 *                 id_pago: 2
 *                 id_empresa_membresia: 3
 *                 referencia_pago: "REF-TRANS-44021"
 *                 paypal_transaction_id: "TXN77291045X"
 *                 payer_email: "finance-corp@empresa.com"
 *                 monto: "149.99"
 *                 moneda: "USD"
 *                 estado_pago: "APROBADO"
 *                 metodo_pago: "PayPal"
 *                 respuesta_paypal: "{\"status\":\"COMPLETED\",\"intent\":\"CAPTURE\"}"
 *                 fecha_pago: "2026-05-23T21:30:00.000Z"
 *       400:
 *         description: "El ID de registro de pago no es válido o está ausente"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Registro de pago no encontrado
 */
router.get('/:id', authenticateJWT, getPaymentById);

/**
 * @openapi
 * /api/membership-payments/membership/{id_empresa_membresia}:
 *   get:
 *     summary: Obtiene la relación de cobros asociados a una suscripción de empresa en particular
 *     tags: [Pagos de Membresías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_empresa_membresia
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del contrato de membresía de empresa para consultar sus pagos
 *     responses:
 *       200:
 *         description: "Colección de pagos vinculados al contrato de membresía empresarial recuperada (success true, data payments)"
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
 *                       id_pago:
 *                         type: integer
 *                         example: 2
 *                       id_empresa_membresia:
 *                         type: integer
 *                         example: 3
 *                       referencia_pago:
 *                         type: string
 *                         example: "REF-TRANS-44021"
 *                       paypal_transaction_id:
 *                         type: string
 *                         example: "TXN77291045X"
 *                       payer_email:
 *                         type: string
 *                         example: "finance-corp@empresa.com"
 *                       monto:
 *                         type: string
 *                         example: "149.99"
 *                       moneda:
 *                         type: string
 *                         example: "USD"
 *                       estado_pago:
 *                         type: string
 *                         example: "APROBADO"
 *                       metodo_pago:
 *                         type: string
 *                         example: "PayPal"
 *                       respuesta_paypal:
 *                         type: string
 *                         example: "{\"status\":\"COMPLETED\",\"intent\":\"CAPTURE\"}"
 *                       fecha_pago:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-23T21:30:00.000Z"
 *             example:
 *               success: true
 *               data:
 *                 - id_pago: 2
 *                   id_empresa_membresia: 3
 *                   referencia_pago: "REF-TRANS-44021"
 *                   paypal_transaction_id: "TXN77291045X"
 *                   payer_email: "finance-corp@empresa.com"
 *                   monto: "149.99"
 *                   moneda: "USD"
 *                   estado_pago: "APROBADO"
 *                   metodo_pago: "PayPal"
 *                   respuesta_paypal: "{\"status\":\"COMPLETED\",\"intent\":\"CAPTURE\"}"
 *                   fecha_pago: "2026-05-23T21:30:00.000Z"
 *       401:
 *         description: No autorizado
 */
router.get('/membership/:id_empresa_membresia', authenticateJWT, getPaymentsByMembership);

/**
 * @openapi
 * /api/membership-payments:
 *   post:
 *     summary: Registra un nuevo comprobante de pago o respuesta de pasarela internacional
 *     tags: [Pagos de Membresías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_empresa_membresia
 *               - monto
 *               - moneda
 *               - estado_pago
 *               - metodo_pago
 *               - referencia_pago
 *             properties:
 *               id_empresa_membresia:
 *                 type: string
 *                 example: "3"
 *               referencia_pago:
 *                 type: string
 *                 example: "REF-TRANS-44021"
 *               paypal_transaction_id:
 *                 type: string
 *                 example: "TXN77291045X"
 *               payer_email:
 *                 type: string
 *                 example: "finance-corp@empresa.com"
 *               monto:
 *                 type: number
 *                 example: 149.99
 *               moneda:
 *                 type: string
 *                 example: "USD"
 *               estado_pago:
 *                 type: string
 *                 description: "Situación del pago (ej. APROBADO, PENDIENTE, RECHAZADO)"
 *                 example: "APROBADO"
 *               metodo_pago:
 *                 type: string
 *                 example: "PayPal"
 *               respuesta_paypal:
 *                 type: string
 *                 description: "Respuesta en crudo o cadena JSON del webhook/API de la pasarela"
 *                 example: "{\"status\":\"COMPLETED\",\"intent\":\"CAPTURE\"}"
 *               fecha_pago:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-23T17:30:00.000Z"
 *           example:
 *             id_empresa_membresia: "3"
 *             referencia_pago: "REF-TRANS-44021"
 *             paypal_transaction_id: "TXN77291045X"
 *             payer_email: "finance-corp@empresa.com"
 *             monto: 149.99
 *             moneda: "USD"
 *             estado_pago: "APROBADO"
 *             metodo_pago: "PayPal"
 *             respuesta_paypal: "{\"status\":\"COMPLETED\",\"intent\":\"CAPTURE\"}"
 *             fecha_pago: "2026-05-23T17:30:00.000Z"
 *     responses:
 *       201:
 *         description: "Transacción financiera registrada y archivada con éxito (success true, data newPayment)"
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
 *                     id_pago:
 *                       type: integer
 *                       example: 1
 *                     id_empresa_membresia:
 *                       type: integer
 *                       example: 3
 *                     referencia_pago:
 *                       type: string
 *                       example: "REF-TRANS-44021"
 *                     paypal_transaction_id:
 *                       type: string
 *                       example: "TXN77291045X"
 *                     payer_email:
 *                       type: string
 *                       example: "finance-corp@empresa.com"
 *                     monto:
 *                       type: string
 *                       example: "149.99"
 *                     moneda:
 *                       type: string
 *                       example: "USD"
 *                     estado_pago:
 *                       type: string
 *                       example: "APROBADO"
 *                     metodo_pago:
 *                       type: string
 *                       example: "PayPal"
 *                     respuesta_paypal:
 *                       type: string
 *                       example: "{\"status\":\"COMPLETED\",\"intent\":\"CAPTURE\"}"
 *                     fecha_pago:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-23T21:30:00.000Z"
 *             example:
 *               success: true
 *               data:
 *                 id_pago: 1
 *                 id_empresa_membresia: 3
 *                 referencia_pago: "REF-TRANS-44021"
 *                 paypal_transaction_id: "TXN77291045X"
 *                 payer_email: "finance-corp@empresa.com"
 *                 monto: "149.99"
 *                 moneda: "USD"
 *                 estado_pago: "APROBADO"
 *                 metodo_pago: "PayPal"
 *                 respuesta_paypal: "{\"status\":\"COMPLETED\",\"intent\":\"CAPTURE\"}"
 *                 fecha_pago: "2026-05-23T21:30:00.000Z"
 *       400:
 *         description: "Faltan parámetros obligatorios de auditoría fiscal (id_empresa_membresia, monto, moneda, estado_pago, metodo_pago, referencia_pago)"
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
 *                   example: "Faltan parámetros obligatorios de auditoría fiscal (id_empresa_membresia, monto, moneda, estado_pago, metodo_pago, referencia_pago)"
 *             example:
 *               success: false
 *               message: "Faltan parámetros obligatorios de auditoría fiscal (id_empresa_membresia, monto, moneda, estado_pago, metodo_pago, referencia_pago)"
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticateJWT, createPayment);

/**
 * @openapi
 * /api/membership-payments/{id}:
 *   put:
 *     summary: Modifica los parámetros de control, referencias o conciliación de un pago existente
 *     tags: [Pagos de Membresías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pago a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_empresa_membresia:
 *                 type: string
 *                 example: "3"
 *               paypal_transaction_id:
 *                 type: string
 *                 example: "TXN77291045X"
 *               payer_email:
 *                 type: string
 *                 example: "finance-corp@empresa.com"
 *               monto:
 *                 type: number
 *                 example: 150
 *               moneda:
 *                 type: string
 *                 example: "USD"
 *               estado_pago:
 *                 type: string
 *                 example: "APROBADO"
 *               metodo_pago:
 *                 type: string
 *                 example: "PayPal"
 *               respuesta_paypal:
 *                 type: string
 *                 example: "{\"status\":\"COMPLETED\",\"intent\":\"CAPTURE\"}"
 *               fecha_pago:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-23T17:30:00.000Z"
 *               referencia_pago:
 *                 type: string
 *                 example: "REF-CONCIL-55"
 *           example:
 *             id_empresa_membresia: "3"
 *             paypal_transaction_id: "TXN77291045X"
 *             payer_email: "finance-corp@empresa.com"
 *             monto: 150
 *             moneda: "USD"
 *             estado_pago: "APROBADO"
 *             metodo_pago: "PayPal"
 *             respuesta_paypal: "{\"status\":\"COMPLETED\",\"intent\":\"CAPTURE\"}"
 *             fecha_pago: "2026-05-23T17:30:00.000Z"
 *             referencia_pago: "REF-CONCIL-55"
 *     responses:
 *       200:
 *         description: "Registro de pago actualizado de forma satisfactoria (success true, data updatedPayment)"
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
 *                     id_pago:
 *                       type: integer
 *                       example: 1
 *                     id_empresa_membresia:
 *                       type: integer
 *                       example: 3
 *                     referencia_pago:
 *                       type: string
 *                       example: "REF-TRANS-44021"
 *                     paypal_transaction_id:
 *                       type: string
 *                       example: "TXN77291045X"
 *                     payer_email:
 *                       type: string
 *                       example: "finance-corp@empresa.com"
 *                     monto:
 *                       type: string
 *                       example: "150.00"
 *                     moneda:
 *                       type: string
 *                       example: "USD"
 *                     estado_pago:
 *                       type: string
 *                       example: "APROBADO"
 *                     metodo_pago:
 *                       type: string
 *                       example: "PayPal"
 *                     respuesta_paypal:
 *                       type: string
 *                       example: "{\"status\":\"COMPLETED\",\"intent\":\"CAPTURE\"}"
 *                     fecha_pago:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-23T21:30:00.000Z"
 *             example:
 *               success: true
 *               data:
 *                 id_pago: 1
 *                 id_empresa_membresia: 3
 *                 referencia_pago: "REF-TRANS-44021"
 *                 paypal_transaction_id: "TXN77291045X"
 *                 payer_email: "finance-corp@empresa.com"
 *                 monto: "150.00"
 *                 moneda: "USD"
 *                 estado_pago: "APROBADO"
 *                 metodo_pago: "PayPal"
 *                 respuesta_paypal: "{\"status\":\"COMPLETED\",\"intent\":\"CAPTURE\"}"
 *                 fecha_pago: "2026-05-23T21:30:00.000Z"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Registro transaccional no encontrado para actualizar
 */
router.put('/:id', authenticateJWT, updatePayment);

/**
 * @openapi
 * /api/membership-payments/{id}:
 *   delete:
 *     summary: Elimina permanentemente un registro de pago de la base de datos
 *     tags: [Pagos de Membresías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pago a eliminar permanentemente
 *     responses:
 *       200:
 *         description: "Registro de pago removido de la base de datos con éxito (success true)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *             example:
 *               success: true
 *       400:
 *         description: "El ID enviado no cumple con las condiciones requeridas de borrado"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Registro de pago no encontrado en el sistema contable
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
 *                   example: "El registro de pago no existe en la base de datos"
 *             example:
 *               success: false
 *               message: "El registro de pago no existe en la base de datos"
 */
router.delete('/:id', authenticateJWT, deletePayment);

export default router;