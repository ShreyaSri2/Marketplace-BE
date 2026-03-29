import { z } from "zod";

export const createItemSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string(),
  condition: z.string(),
  image: z.string().optional(),
});

export const updateItemSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  category: z.string().optional(),
  condition: z.string().optional(),
  image: z.string().optional(),
});