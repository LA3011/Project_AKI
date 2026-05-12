import express, { type Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { errorHandler } from './middlewares/error.handler.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';

import { viewConnection } from './config/database.pg.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './config/swagger.js';
import { globalRateLimit } from './middlewares/rateLimit.handler.js';

// Configuración [variables de entorno]
dotenv.config();

// Configuracion Server
const app: Application = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost'

// Test Conectividad DataBase
viewConnection();

// Middlewares [Globales]
app.use(cors());
app.use(express.json());
app.use(globalRateLimit);

// Rutas
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Middleware [Manejo de Errores]
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Server] running on http://${HOST}:${PORT}`);
});
