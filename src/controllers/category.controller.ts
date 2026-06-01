import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import * as CategoryService from '../services/category.service.js';

export const getCategories = catchAsync(async (_req: Request, res: Response) => {
    const categories = await CategoryService.getAllCategories();
    res.status(200).json({ success: true, data: categories });
});

export const getCategoryById = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;

    if (!id || typeof (id) != 'string') {
        return res.status(400).json({ success: false, message: 'El ID proporcionado no es Válido' });
    }

    const category = await CategoryService.getCategoryById(id);

    if (!category) {
        return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }

    res.status(200).json({ success: true, data: category });
});

export const createCategory = catchAsync(async (req: Request, res: Response) => {

    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
        return res.status(400).json({
            success: false,
            message: 'Faltan campos obligatorios para generar la Categoria (nombre, descripcion)'
        });
    }

    const newCategory = await CategoryService.createCategory(req.body);
    res.status(201).json({ success: true, data: newCategory });
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;

    if (!id || typeof (id) != 'string') {
        return res.status(400).json({ success: false, message: 'El ID proporcionado no es Válido' });
    }

    const updatedCategory = await CategoryService.updateCategory(id, req.body);

    if (!updatedCategory) {
        return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }

    res.status(200).json({ success: true, data: updatedCategory });
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;

    if (!id || typeof (id) != 'string') {
        return res.status(400).json({ success: false, message: 'El ID proporcionado no es Válido' });
    }

    const deletedCategory = await CategoryService.deleteCategory(id);

    if (!deletedCategory) {
        return res.status(404).json({ success: false, message: 'Categoría no encontrada o ya inactiva' });
    }

    res.status(200).json({
        success: true,
        data: deletedCategory
    });
});