import type { Request, Response } from 'express';
import { R2Service } from '../services/r2.service.js';
import dotenv from 'dotenv';

dotenv.config();

// Obtener URL firmada para una imagen específica
export const getSignedImageUrlPost = async (req: Request, res: Response) => {
  try {
      const { key, expires } = req.body;

      // Validar key
      if (!key || typeof key !== 'string' || key.trim() === '') {
          return res.status(400).json({
              success: false,
              message: 'Se requiere una key de imagen válida'
          });
      }

      // Validar expires
      const expiresIn = parseInt(expires) || Number(process.env.R2_TIME_EXPIRE_IMAGE) || 3600;
      const maxExpires = 604800; // 7 días
      const finalExpires = Math.min(expiresIn, maxExpires);

      // Verificar si la imagen existe
      const exists = await R2Service.imageExists(key);
      if (!exists) {
          return res.status(404).json({
              success: false,
              message: 'La imagen no existe',
              key
          });
      }

      // Generar URL firmada
      const signedUrl = await R2Service.getSignedUrl(key, finalExpires);

      res.json({
          success: true,
          url: signedUrl,
          key,
          expiresIn: finalExpires,
          timestamp: Date.now()
      });

  } catch (error: any) {
      console.error('[Image-Controller-Error] getSignedImageUrlPost:', error.message);
      
      if (error.message.includes('NoSuchKey')) {
          return res.status(404).json({
              success: false,
              message: 'La imagen no existe',
              error: error.message
          });
      }

      res.status(500).json({
          success: false,
          message: 'Error al generar URL firmada',
          error: error.message
      });
  }
};

// Obtener URLs firmadas para múltiples imágenes (BATCH)
export const getSignedUrls = async (req: Request, res: Response) => {
  try {
    const { keys, expiresIn } = req.body;

    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return res.status(400).json({
        message: 'Se requiere un array de keys'
      });
    }

    // Validar que todas las keys sean strings válidas
    const validKeys = keys.filter(key => typeof key === 'string' && key.trim() !== '');

    if (validKeys.length === 0) {
      return res.status(400).json({
        message: 'No se proporcionaron keys válidas'
      });
    }

    // Límite de seguridad
    if (validKeys.length > (Number(process.env.R2_MAX_IMAGE_REQUEST) || 100)) {
      return res.status(400).json({
        message: `Máximo ${process.env.R2_MAX_IMAGE_REQUEST || 100} imágenes por petición`
      });
    }

    const expires =
      parseInt(expiresIn) ||
      Number(process.env.R2_TIME_EXPIRE_IMAGE) ||
      3600;

    // Límite máximo de expiración
    const maxExpires = Number(process.env.R2_TIME_EXPIRE_IMAGE) || 3600;
    const finalExpires = Math.min(expires, maxExpires);

    const urls = await R2Service.getSignedUrls(validKeys, finalExpires);

    res.json({
      urls,
      expiresIn: finalExpires,
      timestamp: Date.now() // fecha y hora exacta, que se generaron las URLs firmadas 
    });

  } catch (error: any) {
    console.error('[Image-Controller-Error] ', error.message);
    res.status(500).json({
      message: 'Error al generar URLs firmadas',
      error: error.message
    });
  }
};

// Listar imágenes por carpeta
export const listImagesByFolder = async (req: Request, res: Response) => {
  try {
    const { folder, maxKeys, continuationToken, includeUrls } = req.query;

    if (!folder || typeof folder !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Se requiere especificar una carpeta (folder)',
        example: '/api/images/list?folder=profiles'
      });
    }

    const allowedFolders = ['profiles', 'companies', 'branches', 'posts'];
    if (!allowedFolders.includes(folder)) {
      return res.status(400).json({
        success: false,
        message: `Carpeta no permitida. Permitidas: ${allowedFolders.join(', ')}`
      });
    }

    const maxKeysNum = parseInt(maxKeys as string) || 50;
    const includeUrlsBool = includeUrls !== 'false';
    const maxLimit = Number(process.env.R2_MAX_LIST_IMAGES) || 200;
    const finalMaxKeys = Math.min(maxKeysNum, maxLimit);

    // Crear objeto de opciones paso a paso
    const options: any = {
      maxKeys: finalMaxKeys,
      includeUrls: includeUrlsBool,
    };

    // Solo agregar continuationToken si existe
    if (continuationToken && typeof continuationToken === 'string' && continuationToken.trim() !== '') {
      options.continuationToken = continuationToken;
    }

    const result = await R2Service.listImagesWithSignedUrls(folder, options);

    res.json({
      success: true,
      folder,
      images: result.images,
      continuationToken: result.continuationToken,
      total: result.total,
      limit: finalMaxKeys,
      timestamp: Date.now(),
    });

  } catch (error: any) {
    console.error('[Image-Controller-Error] listImagesByFolder:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al listar las imágenes',
      error: error.message
    });
  }
};