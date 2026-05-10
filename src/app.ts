import express, { type Application, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { errorHandler } from './middlewares/error.handler.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';

// Configuración [variables de entorno]
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares [Globales]
app.use(cors());
app.use(express.json()); // Parseo de JSON

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Middleware [Manejo de Errores]
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
