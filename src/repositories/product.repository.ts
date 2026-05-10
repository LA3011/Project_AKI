import { query } from '../config/database.pg.js';
import { type Product, type CreateProductDTO } from '../interfaces/product.interface.js';

export const ProductRepository = {
  async findAll(): Promise<Product[]> {
    const sql = 'SELECT * FROM products ORDER BY created_at DESC';
    const { rows } = await query(sql);
    return rows;
  },

  async findByCategory(categoryId: number): Promise<Product[]> {
    const sql = 'SELECT * FROM products WHERE category_id = $1';
    const { rows } = await query(sql, [categoryId]);
    return rows;
  },

  async create(data: CreateProductDTO): Promise<Product> {
    const sql = `
      INSERT INTO products (name, description, price, stock, category_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [data.name, data.description, data.price, data.stock, data.category_id];
    const { rows } = await query(sql, values);
    return rows[0];
  },

  async updateStock(id: string, newStock: number): Promise<void> {
    const sql = 'UPDATE products SET stock = $1, updated_at = NOW() WHERE id = $2';
    await query(sql, [newStock, id]);
  }
};
