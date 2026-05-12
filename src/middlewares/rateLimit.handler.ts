import { rateLimit } from 'express-rate-limit';

export const globalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 100,
    standardHeaders: 'draft-7', 
    legacyHeaders: false,
    message: {
        message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo después de 15 minutos.'
    },
    skip: (req) => req.ip === '127.0.0.1',
});

// Estricto: login/registro
export const authRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    message: {
        message: 'Demasiados intentos de acceso. Tu IP ha sido bloqueada por una hora.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
