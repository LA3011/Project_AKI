import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import * as BranchService from '../services/companyBranch.service.js';
import type { CompanyBranch } from '../interfaces/companyBranch.interface.js';
import { R2Service } from '../services/r2.service.js';
import { validateImageOrThrow } from '../utils/image.utils.js';
import dotenv from 'dotenv';

dotenv.config();

export const getBranches = catchAsync(async (_req: Request, res: Response) => {
  const branches = await BranchService.getAllBranches();

  // Extraer todas las keys de fotos de sucursales
  const imageKeys = branches
    .filter((branch): branch is CompanyBranch & { foto_principal: string } =>
      branch.foto_principal !== null && branch.foto_principal !== undefined && branch.foto_principal !== ''
    )
    .map(branch => branch.foto_principal);

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

  // Enriquecer sucursales con URLs firmadas
  const branchesWithImages = branches.map(branch => ({
    ...branch,
    foto_principal_url: branch.foto_principal ? urlMap.get(branch.foto_principal) || null : null
  }));

  res.status(200).json({ success: true, data: branchesWithImages });
});

export const getBranchById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'El ID de sucursal no es válido'
    });
  }

  const branch = await BranchService.getBranchById(id);
  if (!branch) {
    return res.status(404).json({
      success: false,
      message: 'Sucursal no encontrada'
    });
  }

  // Generar URL firmada para la foto
  let fotoPrincipalUrl = null;
  if (branch.foto_principal) {
    fotoPrincipalUrl = await R2Service.getSignedUrl(branch.foto_principal, Number(process.env.R2_TIME_EXPIRE_IMAGE) || 3600);
  }

  res.status(200).json({
    success: true,
    data: {
      ...branch,
      foto_principal_url: fotoPrincipalUrl
    }
  });
});

export const createBranch = catchAsync(async (req: Request, res: Response) => {
  const {
    nombre_sucursal,
    direccion,
    telefono,
    correo,
    descripcion,
    id_empresa,
    id_estado,
    id_municipio,
    id_ciudad
  } = req.body;

  // Validar campos obligatorios
  if ( !id_estado || !id_municipio || !id_ciudad || !nombre_sucursal || !direccion || !telefono || !correo || !descripcion || !id_empresa) {
    return res.status(400).json({
      success: false,
      message: 'Faltan campos obligatorios para generar la sucursal (nombre_sucursal, direccion, telefono, correo, descripcion, id_empresa, id_estado, id_municipio, id_ciudad)'
    });
  }

  // Procesar la foto si existe
  let fotoPrincipalKey: string | null = null;

  if (req.file) {
    try {
      validateImageOrThrow(req.file);

      const result = await R2Service.uploadImage(
        req.file.buffer,
        req.file.originalname,
        'companiesBranches/principal',
        {
          width: 800,
          height: 600,
          quality: 80,
          format: 'webp'
        }
      );

      fotoPrincipalKey = result.key;

    } catch (error: any) {
      console.error('[CompanyBranch-Controller-Error] subiendo foto:', error);
      const status = error.status || 400;
      return res.status(status).json({
        success: false,
        message: 'Error al procesar la foto de la sucursal',
        error: error.message || 'Error desconocido'
      });
    }
  }

  // Crear sucursal con la foto
  const branchData: Partial<CompanyBranch> = {
    nombre_sucursal,
    direccion,
    telefono,
    correo,
    descripcion,
    id_empresa: id_empresa,
    id_estado: id_estado,
    id_municipio: id_municipio,
    id_ciudad: id_ciudad,
    foto_principal: fotoPrincipalKey || ''
  };

  const newBranch = await BranchService.createBranch(branchData);

  // Generar URL firmada para la foto
  let fotoPrincipalUrl = null;
  if (newBranch.foto_principal) {
    fotoPrincipalUrl = await R2Service.getSignedUrl(newBranch.foto_principal, Number(process.env.R2_TIME_EXPIRE_IMAGE) || 3600);
  }

  res.status(201).json({
    success: true,
    data: {
      ...newBranch,
      foto_principal_url: fotoPrincipalUrl
    }
  });
});

export const updateBranch = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'El ID de sucursal no es válido'
    });
  }

  // Obtener sucursal actual
  const existingBranch = await BranchService.getBranchById(id);
  if (!existingBranch) {
    return res.status(404).json({
      success: false,
      message: 'Sucursal no encontrada'
    });
  }

  // Procesar nueva foto si se subió
  let fotoPrincipalKey = existingBranch.foto_principal; // Mantener la existente

  if (req.file) {
    try {
      validateImageOrThrow(req.file);

      // foto anterior, eliminarla
      if (existingBranch.foto_principal) {
        try {
          await R2Service.deleteImage(existingBranch.foto_principal);
        } catch (error) {
          console.error('[CompanyBranch-Controller-Error] eliminando foto anterior:', error);
        }
      }

      // Subir nueva foto a R2
      const result = await R2Service.uploadImage(
        req.file.buffer,
        req.file.originalname,
        'companiesBranches/principal',
        {
          width: 800,
          height: 600,
          quality: 80,
          format: 'webp'
        }
      );

      fotoPrincipalKey = result.key;

    } catch (error: any) {
      console.error('[CompanyBranch-Controller-Error] subiendo foto:', error);
      const status = error.status || 400;
      return res.status(status).json({
        success: false,
        message: 'Error al procesar la foto de la sucursal',
        error: error.message || 'Error desconocido'
      });
    }
  }

  // Actualizar sucursal
  const updateData = {
    ...req.body,
    foto_principal: fotoPrincipalKey
  };

  const updatedBranch = await BranchService.updateBranch(id, updateData);
  if (!updatedBranch) {
    return res.status(404).json({
      success: false,
      message: 'Sucursal no encontrada'
    });
  }

  // Generar URL firmada para la nueva foto
  let fotoPrincipalUrl = null;
  if (updatedBranch.foto_principal) {
    fotoPrincipalUrl = await R2Service.getSignedUrl(updatedBranch.foto_principal, Number(process.env.R2_TIME_EXPIRE_IMAGE) || 3600);
  }

  res.status(200).json({
    success: true,
    data: {
      ...updatedBranch,
      foto_principal_url: fotoPrincipalUrl
    }
  });
});

export const deleteBranch = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'El ID de sucursal no es válido'
    });
  }

  // Obtener sucursal antes de eliminar
  const existingBranch = await BranchService.getBranchById(id);
  if (!existingBranch) {
    return res.status(404).json({
      success: false,
      message: 'Sucursal no encontrada'
    });
  }

  // Eliminar foto de R2 si existe
  if (existingBranch.foto_principal) {
    try {
      await R2Service.deleteImage(existingBranch.foto_principal);
    } catch (error) {
      console.error('[CompanyBranch-Controller-Error] eliminando foto de R2:', error);
    }
  }

  const deletedBranch = await BranchService.deleteBranch(id);
  if (!deletedBranch) {
    return res.status(404).json({
      success: false,
      message: 'Sucursal no encontrada o inactiva'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Sucursal desactivada exitosamente',
    data: deletedBranch
  });
});