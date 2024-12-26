import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  purchasePrice: z.number().min(0, 'Purchase price must be greater than 0'),
  salePrice: z.number().min(0, 'Sale price must be greater than 0'),
  stock: z.enum(['in-stock', 'out-of-stock'], {
    required_error: 'Stock is required',
    invalid_type_error: 'Stock must be "in-stock" or "out-of-stock"',
  }),
  unit: z.string().min(1, 'Unit is required'),
  category: z.string().min(1, 'Category is required'),
});
export type CreateProductSchema = z.infer<typeof createProductSchema>;
