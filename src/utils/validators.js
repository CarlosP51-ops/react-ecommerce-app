import { z } from 'zod';

// Schéma de connexion
export const loginSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

// Schéma d'inscription
export const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Doit contenir au moins un chiffre'),
  confirmPassword: z.string(),
  role: z.enum(['client', 'vendor']).default('client'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// Schéma produit
export const productSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères').max(100),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères').max(2000),
  price: z.number().min(0.99, 'Le prix doit être au moins de $0.99').max(9999.99),
  category: z.string().min(1, 'Catégorie requise'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags'),
  licenseType: z.enum(['personal', 'commercial', 'extended']),
  fileSize: z.number().max(100 * 1024 * 1024, 'Fichier trop volumineux (max 100MB)'),
});

// Schéma d'avis
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(500),
});

// Schéma de retrait
export const payoutSchema = z.object({
  amount: z.number().min(10, 'Minimum $10'),
  method: z.enum(['paypal', 'bank_transfer', 'stripe']),
  accountDetails: z.object({}),
});

// Schéma de paramètres admin
export const settingsSchema = z.object({
  commissionRate: z.number().min(0).max(50, 'Commission max 50%'),
  siteName: z.string().min(1),
  maintenanceMode: z.boolean(),
  allowRegistrations: z.boolean(),
  maxFileSize: z.number(),
  allowedFileTypes: z.array(z.string()),
});