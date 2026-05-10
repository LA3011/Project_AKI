export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    category_id: number;
    created_at: Date;
    updated_at: Date;
}

export type CreateProductDTO = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

// Actualizaciones parciales
export type UpdateProductDTO = Partial<CreateProductDTO>;
