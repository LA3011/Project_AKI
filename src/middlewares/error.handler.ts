import { type Request, type Response, type NextFunction } from 'express';
import { AppError } from '../utils/custom.error.js';

export const errorHandler = (
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {

    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const environment = process.env.NODE_ENV || 'development';

    if (environment === 'development') console.error(err.stack);

    // Respuesta al cliente
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: err.message || 'Internal Server Error',
        ...(environment === 'development' && { stack: err.stack }),
    });
};
