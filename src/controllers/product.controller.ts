import { type Request, type Response } from 'express';
import { ProductRepository } from '../repositories/product.repository.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/custom.error.js';

export const getProducts = catchAsync(async (_req: Request, res: Response) => {
  const products = await ProductRepository.findAll();
  res.status(200).json({ success: true, data: products });
});

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const { name, price, stock, category_id } = req.body;

  if (!name || !price || !stock || category_id) {
    throw new AppError('El nombre y el precio son obligatorios', 400);
  }

  const newProduct = await ProductRepository.create(req.body);
  res.status(201).json({ success: true, data: newProduct });
});
