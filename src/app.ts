import express, { type Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { viewConnection } from './config/database.pg.js';
import { swaggerDocs } from './config/swagger.js';
import dotenv from 'dotenv';
import cors from 'cors';

import { globalRateLimit } from './middlewares/rateLimit.handler.js';
import { errorHandler } from './middlewares/error.handler.js';

import profileModulePrivilegeRoutes from './routes/profileModulePrivilege.routes.js';
import companyAdministratorRoutes from './routes/companyAdministrator.routes.js';
import membershipPaymentRoutes from './routes/membershipPayments.routes.js';
import companyMembershipRoutes from './routes/companyMemberships.routes.js';
import paymentMethodRoutes from './routes/paymentMethods.routes.js';
import administratorRoutes from './routes/administrator.routes.js';
import companyBranchRoutes from './routes/companyBranch.routes.js';
import membershipRoutes from './routes/membership.routes.js';
import scheduleRoutes from './routes/schedules.routes.js';
import bitacoraRoutes from './routes/bitacora.routes.js';
import categoryRoutes from './routes/category.routes.js';
import companyRoutes from './routes/company.routes.js';
import profileRoutes from './routes/profile.routes.js';
import rewardRoutes from './routes/reward.routes.js';
import clientRoutes from './routes/client.routes.js';
import locateRoutes from './routes/locate.routes.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import imageRoutes from './routes/image.routes.js';

// Configuración [variables de entorno]
dotenv.config();

// Configuracion Server
const app: Application = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost'
const PROTOCOL = process.env.PROTOCOL || 'http'

// Test Conectividad DataBase
viewConnection();

// Middlewares [Globales]
app.use(cors());
app.use(express.json());
app.use(globalRateLimit);
 
// View | Download Doc 
if (process.env.NODE_ENV !== 'production') {
  app.get('/api-docs.json', (req, res) => {
    res.json(swaggerDocs);
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

// Rutas 
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/locates', locateRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/bitacoras', bitacoraRoutes); 
app.use('/api/schedules', scheduleRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/administrators', administratorRoutes);
app.use('/api/company-branches', companyBranchRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/company-memberships', companyMembershipRoutes);
app.use('/api/membership-payments', membershipPaymentRoutes);
app.use('/api/company-administrators', companyAdministratorRoutes); 
app.use('/api/profile-module-privileges', profileModulePrivilegeRoutes); 

// Middleware [Manejo de Errores]
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Server] running on ${PROTOCOL}://${HOST}:${PORT}`);
});
