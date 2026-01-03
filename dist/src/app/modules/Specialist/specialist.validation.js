"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialistValidation = exports.publishSpecialistSchema = exports.updateSpecialistSchema = exports.createSpecialistSchema = void 0;
const zod_1 = require("zod");
const supportedCompanyTypeSchema = zod_1.z.object({
    name: zod_1.z.string({ message: 'Company type name is required' }),
    description: zod_1.z.string({ message: 'Company type description is required' }),
});
const additionalOfferingSchema = zod_1.z.object({
    name: zod_1.z.string({ message: 'Offering name is required' }),
    description: zod_1.z.string({ message: 'Offering description is required' }),
});
const serviceOfferingSchema = zod_1.z.object({
    name: zod_1.z.string({ message: 'Service offering name is required' }),
});
const mediaSchema = zod_1.z.object({
    file_name: zod_1.z.string({ message: 'File name is required' }),
    file_size: zod_1.z.number({ message: 'File size is required' }).int().positive(),
    mime_type: zod_1.z.enum(['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf']),
    media_type: zod_1.z.enum(['image', 'video', 'document']),
    display_order: zod_1.z.number().int().positive().optional(),
});
exports.createSpecialistSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ message: 'Title is required' }).min(3).max(255),
        description: zod_1.z.string().optional(),
        base_price: zod_1.z
            .number({ message: 'Base price is required' })
            .positive({ message: 'Base price must be positive' }),
        duration_days: zod_1.z.number().int().positive().optional(),
        is_draft: zod_1.z.boolean().optional().default(true),
        service_category: zod_1.z.string().optional(),
        supported_company_types: zod_1.z.array(supportedCompanyTypeSchema).optional(),
        additional_offerings: zod_1.z.array(additionalOfferingSchema).optional(),
        service_offerings_data: zod_1.z.array(serviceOfferingSchema).optional(),
        media: zod_1.z.array(mediaSchema).optional(),
    }),
});
exports.updateSpecialistSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3).max(255).optional(),
        description: zod_1.z.string().optional(),
        base_price: zod_1.z.number().positive({ message: 'Base price must be positive' }).optional(),
        duration_days: zod_1.z.number().int().positive().optional(),
        is_draft: zod_1.z.boolean().optional(),
        is_verified: zod_1.z.boolean().optional(),
        verification_status: zod_1.z.enum(['pending', 'verified', 'rejected']).optional(),
        service_category: zod_1.z.string().optional(),
        supported_company_types: zod_1.z.array(supportedCompanyTypeSchema).optional(),
        additional_offerings: zod_1.z.array(additionalOfferingSchema).optional(),
        service_offerings_data: zod_1.z.array(serviceOfferingSchema).optional(),
        media: zod_1.z.array(mediaSchema).optional(),
    }),
});
exports.publishSpecialistSchema = zod_1.z.object({
    body: zod_1.z.object({
        is_draft: zod_1.z.boolean(),
    }),
});
exports.SpecialistValidation = {
    createSpecialistSchema: exports.createSpecialistSchema,
    updateSpecialistSchema: exports.updateSpecialistSchema,
    publishSpecialistSchema: exports.publishSpecialistSchema,
};
//# sourceMappingURL=specialist.validation.js.map