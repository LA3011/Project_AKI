import multer from 'multer';
import type { Request } from 'express';
import path from 'path';

// Configuración de almacenamiento en memoria (para procesar antes de subir a R2)
const storage = multer.memoryStorage();

// Filtro de archivos
const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagen no permitido. Solo se aceptan: JPEG, PNG, WEBP, GIF'), false);
  }
};

// Límite de tamaño (5MB)
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

export const upload = multer({
  storage,
  fileFilter,
  limits,
});

// Middleware para subida única
export const uploadSingle = (fieldName: string = 'image') => {
  return upload.single(fieldName);
};