import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service.js';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; 

    if (!token) 
      return res.status(401).json({ message: 'Formato de token inválido' });
    
    try {
      const decoded = verifyToken(token);
      req.user = decoded; 
      next();

    } catch (err) {
      res.status(403).json({ message: 'Token inválido o expirado' });
    }
 
  } else {
    res.status(401).json({ message: 'Acceso denegado: No se proporcionó token' });
  }
};
