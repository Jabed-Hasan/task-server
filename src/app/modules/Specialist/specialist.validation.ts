import { z } from 'zod';

const supportedCompanyTypeSchema = z.object({
  name: z.string({ message: 'Company type name is required' }),
  description: z.string({ message: 'Company type description is required' }),
});

const additionalOfferingSchema = z.object({
  name: z.string({ message: 'Offering name is required' }),
  description: z.string({ message: 'Offering description is required' }),
});

const serviceOfferingSchema = z.object({
  name: z.string({ message: 'Service offering name is required' }),
});

const mediaSchema = z.object({
  file_name: z.string({ message: 'File name is required' }),
  file_size: z.number({ message: 'File size is required' }).int().positive(),
  mime_type: z.enum(['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf']),
  media_type: z.enum(['image', 'video', 'document']),
  display_order: z.number().int().positive().optional(),
});

export const createSpecialistSchema = z.object({
  body: z.object({
    title: z.string({ message: 'Title is required' }).min(3).max(255),
    description: z.string().optional(),
    base_price: z
      .number({ message: 'Base price is required' })
      .positive({ message: 'Base price must be positive' }),
    duration_days: z.number().int().positive().optional(),
    is_draft: z.boolean().optional().default(true),
    service_category: z.string().optional(),
    supported_company_types: z.array(supportedCompanyTypeSchema).optional(),
    additional_offerings: z.array(additionalOfferingSchema).optional(),
    service_offerings_data: z.array(serviceOfferingSchema).optional(),
    media: z.array(mediaSchema).optional(),
  }),
});

export const updateSpecialistSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(255).optional(),
    description: z.string().optional(),
    base_price: z.number().positive({ message: 'Base price must be positive' }).optional(),
    duration_days: z.number().int().positive().optional(),
    is_draft: z.boolean().optional(),
    is_verified: z.boolean().optional(),
    verification_status: z.enum(['pending', 'verified', 'rejected']).optional(),
    service_category: z.string().optional(),
    supported_company_types: z.array(supportedCompanyTypeSchema).optional(),
    additional_offerings: z.array(additionalOfferingSchema).optional(),
    service_offerings_data: z.array(serviceOfferingSchema).optional(),
    media: z.array(mediaSchema).optional(),
  }),
});

export const publishSpecialistSchema = z.object({
  body: z.object({
    is_draft: z.boolean(),
  }),
});

export const SpecialistValidation = {
  createSpecialistSchema,
  updateSpecialistSchema,
  publishSpecialistSchema,
};
