import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import * as CompanyService from '../services/company.service.js';
import { R2Service } from '../services/r2.service.js';
import type { Company } from '../interfaces/company.interface.js';
import { validateImageOrThrow } from '../utils/image.utils.js';
import dotenv from 'dotenv';

dotenv.config();

export const getCompanies = catchAsync(async (_req: Request, res: Response) => {
    const companies = await CompanyService.getAllCompanies();

    const imageKeys = companies
        .filter((company): company is Company & { logo: string } =>
            company.logo !== null && company.logo !== undefined && company.logo !== ''
        )
        .map(company => company.logo);

    // Generar URLs firmadas en batch (si hay imágenes)
    let signedUrls: { key: string; url: string }[] = [];
    if (imageKeys.length > 0) {
        signedUrls = await R2Service.getSignedUrls(imageKeys, 3600);
    }

    // Crear un mapa para acceso rápido key -> url
    const urlMap = new Map();
    signedUrls.forEach(({ key, url }) => {
        urlMap.set(key, url);
    });

    // Enriquecer las empresas con las URLs firmadas
    const companiesWithImages = companies.map(company => ({
        ...company,
        logo_url: company.logo ? urlMap.get(company.logo) || null : null
    }));

    res.status(200).json({
        success: true,
        data: companiesWithImages
    });
});

export const getCompanyById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de la empresa no es válido' });
    }

    const company = await CompanyService.getCompanyById(id);
    if (!company) {
        return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
    }

    // Generar URL firmada para la foto de logo si existe
    let logoUrl = null;
    if (company.logo) {
        logoUrl = await R2Service.getSignedUrl(company.logo, 3600);
    }

    // Generar URLs firmadas para las imágenes de los posts
    const postsWithImages = company.post
        ? await Promise.all(
            company.post.map(async (post: any) => ({
                ...post,
                url: post.key ? await R2Service.getSignedUrl(post.key, 3600) : null // ✅ Solo si tiene key
            }))
        )
        : [];

    // Extraer todas las imágenes de los posts para el array 'imagenes'
    const imagenesUrls = company.post
        ? await Promise.all(
            company.post
                .filter((post: any) => post.key)
                .map(async (post: any) => ({
                    id_post: post.id_post,
                    key: post.key,
                    url: await R2Service.getSignedUrl(post.key, 3600)
                }))
        )
        : [];

    res.status(200).json({
        success: true,
        data: company,
        logo_url: logoUrl,
        posts: postsWithImages,
        imagenes: imagenesUrls,
    });
});

export const createCompany = catchAsync(async (req: Request, res: Response) => {

    const {
        descripcion,
        id_usuario,
        id_estado,
        id_municipio,
        id_ciudad, 
        nombre_comercial,
        id_categoria,
        razon_social,
        rif,
        pagina_web
    } = req.body;

    if (!descripcion || !id_usuario || !id_estado || !id_municipio || !id_ciudad || !nombre_comercial || !id_categoria) {
        return res.status(400).json({
            success: false,
            message: 'Faltan campos obligatorios para generar la empresa/entidad (descripcion, id_usuario, id_estado, id_municipio, id_ciudad, nombre_comercial, id_categoria)'
        });
    }

    let logoKey: string | null = null;
    if (req.file) {
        try {
            // Validar la imagen
            validateImageOrThrow(req.file);

            // Subir a R2
            const result = await R2Service.uploadImage(
                req.file.buffer,
                req.file.originalname,
                'companies/logo',
                {
                    width: 400,
                    height: 400,
                    quality: 80,
                    format: 'webp'
                }
            );

            logoKey = result.key;

        } catch (error: any) {
            console.error('[Company-Controller-Error] subiendo logo:', error);
            const status = error.status || 400;
            return res.status(status).json({
                success: false,
                message: 'Error al procesar el logo de la empresa',
                error: error.message || 'Error desconocido'
            });
        }
    }

    const companyData = {
        descripcion,
        id_usuario,
        id_estado,
        id_municipio,
        id_ciudad,
        nombre_comercial,
        razon_social,
        rif,
        pagina_web,
        id_categoria,
        logo: logoKey
    };

    const newCompany = await CompanyService.createCompany(companyData);

    // Generar URL firmada para el logo(si existe)
    let logoUrl = null;
    if (newCompany.logo) {
        logoUrl = await R2Service.getSignedUrl(newCompany.logo, Number(process.env.R2_TIME_EXPIRE_IMAGE) || 3600); 
    }

    res.status(201).json({
        success: true,
        data: {
            ...newCompany,
            logo_url: logoUrl
        }
    });
});

export const updateCompany = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de la empresa no es válido' });
    }

    const existingCompany = await CompanyService.getCompanyById(id);
    if (!existingCompany) {
        return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
    }

    let logoKey = existingCompany.logo; // Mantener el logo existente

    if (req.file) {
        try {
            // Validar la imagen
            validateImageOrThrow(req.file);

            // Si tenía logo anterior, eliminarlo
            if (existingCompany.logo) {
                try {
                    await R2Service.deleteImage(existingCompany.logo);
                } catch (error) {
                    console.error('[Company-Controller-Error] eliminando logo anterior:', error);
                }
            }

            // Subir nuevo logo a R2
            const result = await R2Service.uploadImage(
                req.file.buffer,
                req.file.originalname,
                'companies/logo',
                {
                    width: 400,
                    height: 400,
                    quality: 80,
                    format: 'webp'
                }
            );

            logoKey = result.key;

        } catch (error: any) {
            console.error('[Company-Controller-Error] subiendo logo:', error);
            const status = error.status || 400;
            return res.status(status).json({
                success: false,
                message: 'Error al procesar el logo de la empresa',
                error: error.message || 'Error desconocido'
            });
        }
    }

    const updateData = {
        ...req.body,
        logo: logoKey
    };

    const updatedCompany = await CompanyService.updateCompany(id, updateData);
    if (!updatedCompany) {
        return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
    }

    // Generar URL firmada para el logo (si existe)
    let logoUrl = null;
    if (updatedCompany.logo) {
        logoUrl = await R2Service.getSignedUrl(updatedCompany.logo, 3600);
    }

    res.status(200).json({
        success: true,
        data: {
            ...updatedCompany,
            logo_url: logoUrl 
        }
    });
});

export const deleteCompany = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de la empresa no es válido' });
    }

    const existingCompany = await CompanyService.getCompanyById(id);
    if (!existingCompany) {
        return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
    }

    // Eliminar el logo de R2 si existe
    if (existingCompany.logo) {
        try {
            await R2Service.deleteImage(existingCompany.logo);
        } catch (error) {
            console.error('[Company-Controller-Error] eliminando logo de R2:', error);
        }
    }

    const deletedCompany = await CompanyService.deleteCompany(id);
    if (!deletedCompany) {
        return res.status(404).json({ success: false, message: 'Empresa no encontrada o ya inactiva' });
    }

    res.status(200).json({
        success: true,
        message: 'Empresa desactivada exitosamente',
        data: deletedCompany
    });
});