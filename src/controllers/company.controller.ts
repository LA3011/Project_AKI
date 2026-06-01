import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import * as CompanyService from '../services/company.service.js';

export const getCompanies = catchAsync(async (_req: Request, res: Response) => {
    const companies = await CompanyService.getAllCompanies();
    res.status(200).json({ success: true, data: companies });
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

    res.status(200).json({ success: true, data: company });
});

export const createCompany = catchAsync(async (req: Request, res: Response) => {


    const { descripcion, id_usuario, id_estado, id_municipio, id_ciudad, nombre_comercial } = req.body;

    if (!descripcion || !id_usuario || !id_estado || !id_municipio || !id_ciudad || !nombre_comercial) {
        return res.status(400).json({
            success: false,
            message: 'Faltan campos obligatorios para generar la empresa/entidad (descripcion, id_usuario, id_estado, id_municipio, id_ciudad, nombre_comercial)'
        });
    }

    const newCompany = await CompanyService.createCompany(req.body);
    res.status(201).json({ success: true, data: newCompany });
});

export const updateCompany = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de la empresa no es válido' });
    }

    const updatedCompany = await CompanyService.updateCompany(id, req.body);
    if (!updatedCompany) {
        return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
    }

    res.status(200).json({ success: true, data: updatedCompany });
});

export const deleteCompany = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'El ID de la empresa no es válido' });
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