import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import * as UserService from '../services/user.service.js';
import type { User } from '../interfaces/user.interface.js';
import { R2Service } from '../services/r2.service.js';
import { validateImageOrThrow } from '../utils/image.utils.js';
import dotenv from 'dotenv';

dotenv.config();

export const getUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await UserService.getAllUsers();

  // Extraer todas las keys de fotos de perfil
  const imageKeys = users
    .filter((user): user is User & { foto_perfil: string } =>
      user.foto_perfil !== null && user.foto_perfil !== undefined && user.foto_perfil !== ''
    )
    .map(user => user.foto_perfil);

  // Generar URLs firmadas en batch
  let signedUrls: { key: string; url: string }[] = [];
  if (imageKeys.length > 0) {
    signedUrls = await R2Service.getSignedUrls(imageKeys, Number(process.env.R2_TIME_EXPIRE_IMAGE) || 3600);
  }

  // Crear mapa key -> url
  const urlMap = new Map();
  signedUrls.forEach(({ key, url }) => {
    urlMap.set(key, url);
  });

  // Enriquecer usuarios con URLs firmadas
  const usersWithImages = users.map(user => ({
    ...user,
    foto_perfil_url: user.foto_perfil ? urlMap.get(user.foto_perfil) || null : null
  }));

  res.status(200).json({
    success: true,
    data: usersWithImages
  });

});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'El ID proporcionado no es válido'
    });
  }

  const user = await UserService.getUserById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  // Generar URL firmada para la foto de perfil
  let fotoPerfilUrl = null;
  if (user.foto_perfil) {
    fotoPerfilUrl = await R2Service.getSignedUrl(user.foto_perfil, Number(process.env.R2_TIME_EXPIRE_IMAGE) || 3600);
  }

  res.status(200).json({
    success: true,
    data: {
      ...user,
      foto_perfil_url: fotoPerfilUrl
    }
  });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'El ID proporcionado no es válido'
    });
  }

  // Obtener usuario actual
  const existingUser = await UserService.getUserById(id);
  if (!existingUser) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  // Procesar nueva foto de perfil si se subió
  let fotoPerfilKey = existingUser.foto_perfil; // Mantener la existente

  if (req.file) {
    try {
      validateImageOrThrow(req.file);

      // foto anterior, eliminarla
      if (existingUser.foto_perfil) {
        try {
          await R2Service.deleteImage(existingUser.foto_perfil);
        } catch (error) {
          console.error('[User-Controller-Error] eliminando foto anterior:', error);
        }
      }

      // Subir nueva foto a R2
      const result = await R2Service.uploadImage(
        req.file.buffer,
        req.file.originalname,
        'profiles',
        {
          width: 400,
          height: 400,
          quality: 80,
          format: 'webp'
        }
      );

      fotoPerfilKey = result.key;

    } catch (error: any) {
      console.error('[User-Controller-Error] subiendo foto:', error);
      const status = error.status || 400;
      return res.status(status).json({
        success: false,
        message: 'Error al procesar la foto de perfil',
        error: error.message || 'Error desconocido'
      });
    }
  }

  const updateData = {
    ...req.body,
    foto_perfil: fotoPerfilKey
  };

  const updatedUser = await UserService.updateUser(id, updateData);

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  // Generar URL firmada para la nueva foto
  let fotoPerfilUrl = null;
  if (updatedUser.foto_perfil) {
    fotoPerfilUrl = await R2Service.getSignedUrl(updatedUser.foto_perfil, Number(process.env.R2_TIME_EXPIRE_IMAGE) || 3600);
  }

  res.status(200).json({
    success: true,
    data: {
      ...updatedUser,
      foto_perfil_url: fotoPerfilUrl
    }
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'El ID proporcionado no es válido'
    });
  }

  // Obtener usuario antes de eliminar
  const existingUser = await UserService.getUserById(id);
  if (!existingUser) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  // Eliminar foto de R2 si existe
  if (existingUser.foto_perfil) {
    try {
      await R2Service.deleteImage(existingUser.foto_perfil);
    } catch (error) {
      console.error('[User-Controller-Error] eliminando foto de R2:', error);
    }
  }

  const user = await UserService.deleteUser(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado o ya inactivo'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Usuario desactivado exitosamente',
    data: user
  });
}); 