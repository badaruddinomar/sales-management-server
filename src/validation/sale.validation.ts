import { z } from 'zod';

export const createSaleSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerPhone: z
    .string()
    .regex(/^[0-9]+$/, 'Customer phone must contain only numbers')
    .min(10, 'Customer phone must be at least 10 digits')
    .max(15, 'Customer phone must be at most 15 digits'),
  products: z
    .array(
      z.object({
        product: z.string().min(1, 'Product is required'),
        unitAmount: z.number().min(1, 'Unit amount must be at least 1'),
        unit: z.string().min(1, 'Unit is required'),
        salePrice: z
          .number()
          .min(0, 'Sale price must be a non-negative number'),
      }),
    )
    .min(1, 'At least one product is required'),
  totalAmount: z.number().min(0, 'Total amount must be a non-negative number'),
  paymentMethod: z.enum(['CASH', 'CARD', 'ONLINE']).optional(),
  saleDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
});

export type CreateSaleSchema = z.infer<typeof createSaleSchema>;

export const updateSaleSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required').optional(),
  customerPhone: z
    .string()
    .regex(/^[0-9]+$/, 'Customer phone must contain only numbers')
    .min(10, 'Customer phone must be at least 10 digits')
    .max(15, 'Customer phone must be at most 15 digits')
    .optional(),
  products: z
    .array(
      z.object({
        product: z.string().min(1, 'Product is required').optional(),
        unitAmount: z
          .number()
          .min(1, 'Unit amount must be at least 1')
          .optional(),
        unit: z.string().min(1, 'Unit is required').optional(),
        salePrice: z
          .number()
          .min(0, 'Sale price must be a non-negative number')
          .optional(),
      }),
    )
    .min(1, 'At least one product is required')
    .optional(),
  totalAmount: z
    .number()
    .min(0, 'Total amount must be a non-negative number')
    .optional(),
  paymentMethod: z.enum(['CASH', 'CARD', 'ONLINE']).optional(),
  saleDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    })
    .optional(),
});

export type UpdateSaleSchema = z.infer<typeof updateSaleSchema>;
