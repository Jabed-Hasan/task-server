"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialistService = void 0;
const database_1 = require("../../../config/database");
const Specialist_entity_1 = require("../../../entities/Specialist.entity");
const Media_entity_1 = require("../../../entities/Media.entity");
const PlatformFee_entity_1 = require("../../../entities/PlatformFee.entity");
const paginationHelper_1 = require("../../../helper/paginationHelper");
const typeorm_1 = require("typeorm");
const specialistRepository = database_1.AppDataSource.getRepository(Specialist_entity_1.Specialist);
const mediaRepository = database_1.AppDataSource.getRepository(Media_entity_1.Media);
const platformFeeRepository = database_1.AppDataSource.getRepository(PlatformFee_entity_1.PlatformFee);
// Helper function to generate slug
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
};
// Helper function to calculate platform fee
const calculatePlatformFee = async (basePrice) => {
    const platformFees = await platformFeeRepository.find({
        where: { deleted_at: false },
    });
    for (const fee of platformFees) {
        if (basePrice >= fee.min_value && basePrice <= fee.max_value) {
            return (basePrice * fee.platform_fee_percentage) / 100;
        }
    }
    return 0;
};
// Create Specialist
const createSpecialist = async (payload, createdBy) => {
    const { media, ...specialistData } = payload;
    // Generate slug from title
    const slug = generateSlug(specialistData.title);
    // Calculate platform fee and final price
    const platformFee = await calculatePlatformFee(specialistData.base_price);
    const finalPrice = specialistData.base_price + platformFee;
    const specialist = specialistRepository.create({
        ...specialistData,
        slug,
        platform_fee: platformFee,
        final_price: finalPrice,
        created_by_id: createdBy?.id,
        created_by_name: createdBy?.name,
        supported_company_types: specialistData.supported_company_types,
        additional_offerings: specialistData.additional_offerings,
        service_offerings_data: specialistData.service_offerings_data,
    });
    const savedSpecialist = await specialistRepository.save(specialist);
    // Create media records if provided
    if (media && media.length > 0) {
        const mediaRecords = media.map((m) => mediaRepository.create({
            ...m,
            specialist_id: savedSpecialist.id,
            uploaded_at: new Date(),
            mime_type: m.mime_type,
            media_type: m.media_type,
        }));
        await mediaRepository.save(mediaRecords);
    }
    // Return specialist with relations
    return await specialistRepository.findOne({
        where: { id: savedSpecialist.id },
        relations: ['service_offerings', 'media'],
    });
};
// Get all specialists with filters and pagination
const getAllSpecialists = async (filters, options) => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, min_price, max_price, ...filterData } = filters;
    const whereConditions = {};
    // Search term
    if (searchTerm) {
        whereConditions.title = (0, typeorm_1.Like)(`%${searchTerm}%`);
    }
    // Price range filter
    if (min_price && max_price) {
        whereConditions.base_price = (0, typeorm_1.Between)(min_price, max_price);
    }
    else if (min_price) {
        whereConditions.base_price = (0, typeorm_1.MoreThanOrEqual)(min_price);
    }
    else if (max_price) {
        whereConditions.base_price = (0, typeorm_1.LessThanOrEqual)(max_price);
    }
    // Other filters
    Object.keys(filterData).forEach((key) => {
        if (filterData[key] !== undefined) {
            whereConditions[key] = filterData[key];
        }
    });
    // Exclude soft deleted
    whereConditions.deleted_at = (0, typeorm_1.IsNull)();
    const [result, total] = await specialistRepository.findAndCount({
        where: whereConditions,
        relations: ['service_offerings', 'media'],
        take: limit,
        skip: skip,
        order: {
            [sortBy]: sortOrder,
        },
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
// Get specialist by ID
const getSpecialistById = async (id) => {
    const specialist = await specialistRepository.findOne({
        where: { id, deleted_at: (0, typeorm_1.IsNull)() },
        relations: ['service_offerings', 'media'],
    });
    if (!specialist) {
        throw new Error('Specialist not found');
    }
    return specialist;
};
// Update specialist
const updateSpecialist = async (id, payload) => {
    const specialist = await getSpecialistById(id);
    if (!specialist) {
        throw new Error('Specialist not found');
    }
    const { media, ...updateData } = payload;
    // Update slug if title is changed
    if (updateData.title) {
        updateData.slug = generateSlug(updateData.title);
    }
    // Recalculate platform fee if base price is changed
    if (updateData.base_price) {
        const platformFee = await calculatePlatformFee(updateData.base_price);
        updateData.platform_fee = platformFee;
        updateData.final_price = updateData.base_price + platformFee;
    }
    // Update specialist
    await specialistRepository.update(id, updateData);
    // Update media if provided
    if (media) {
        // Delete existing media
        await mediaRepository.delete({ specialist_id: id });
        // Create new media
        if (media.length > 0) {
            const mediaRecords = media.map((m) => mediaRepository.create({
                ...m,
                specialist_id: id,
                uploaded_at: new Date(),
                mime_type: m.mime_type,
                media_type: m.media_type,
            }));
            await mediaRepository.save(mediaRecords);
        }
    }
    // Return updated specialist
    return await getSpecialistById(id);
};
// Delete specialist (soft delete)
const deleteSpecialist = async (id) => {
    const specialist = await getSpecialistById(id);
    if (!specialist) {
        throw new Error('Specialist not found');
    }
    await specialistRepository.update(id, { deleted_at: new Date() });
};
// Publish/Unpublish specialist
// When publishing: is_draft → false, verification_status → 'under_review'
const publishSpecialist = async (id, isDraft) => {
    const specialist = await getSpecialistById(id);
    if (!specialist) {
        throw new Error('Specialist not found');
    }
    // When publishing (isDraft = false), set verification_status to 'under_review'
    const updateData = { is_draft: isDraft };
    if (!isDraft) {
        // Publishing: Set to under_review for admin approval
        updateData.verification_status = Specialist_entity_1.VerificationStatus.UNDER_REVIEW;
    }
    else {
        // Unpublishing/Drafting: Reset to pending
        updateData.verification_status = Specialist_entity_1.VerificationStatus.PENDING;
        updateData.is_verified = false;
    }
    await specialistRepository.update(id, updateData);
    return await getSpecialistById(id);
};
// Admin approve specialist
const approveSpecialist = async (id) => {
    const specialist = await getSpecialistById(id);
    if (!specialist) {
        throw new Error('Specialist not found');
    }
    // Allow approval from any status except already approved
    if (specialist.verification_status === Specialist_entity_1.VerificationStatus.APPROVED) {
        throw new Error('Specialist is already approved');
    }
    await specialistRepository.update(id, {
        verification_status: Specialist_entity_1.VerificationStatus.APPROVED,
        is_verified: true,
        is_draft: false,
    });
    return await getSpecialistById(id);
};
// Admin reject specialist
const rejectSpecialist = async (id, reason) => {
    const specialist = await getSpecialistById(id);
    if (!specialist) {
        throw new Error('Specialist not found');
    }
    // Allow rejection from any status except already rejected
    if (specialist.verification_status === Specialist_entity_1.VerificationStatus.REJECTED) {
        throw new Error('Specialist is already rejected');
    }
    await specialistRepository.update(id, {
        verification_status: Specialist_entity_1.VerificationStatus.REJECTED,
        is_verified: false,
    });
    return await getSpecialistById(id);
};
// Admin: Submit specialist for review (pending → under_review)
const submitForReview = async (id) => {
    const specialist = await getSpecialistById(id);
    if (!specialist) {
        throw new Error('Specialist not found');
    }
    if (specialist.verification_status === Specialist_entity_1.VerificationStatus.UNDER_REVIEW) {
        throw new Error('Specialist is already under review');
    }
    await specialistRepository.update(id, {
        verification_status: Specialist_entity_1.VerificationStatus.UNDER_REVIEW,
        is_draft: false,
    });
    return await getSpecialistById(id);
};
// Get specialists under review (for Admin)
const getUnderReviewSpecialists = async (options) => {
    return await getAllSpecialists({ verification_status: 'under_review' }, options);
};
// Get approved/live specialists (for public page)
const getApprovedSpecialists = async (options) => {
    return await getAllSpecialists({ verification_status: 'approved', is_verified: true }, options);
};
// Get draft specialists
const getDraftSpecialists = async (options) => {
    return await getAllSpecialists({ is_draft: true }, options);
};
// Get published specialists
const getPublishedSpecialists = async (options) => {
    return await getAllSpecialists({ is_draft: false }, options);
};
exports.SpecialistService = {
    createSpecialist,
    getAllSpecialists,
    getSpecialistById,
    updateSpecialist,
    deleteSpecialist,
    publishSpecialist,
    getDraftSpecialists,
    getPublishedSpecialists,
    approveSpecialist,
    rejectSpecialist,
    submitForReview,
    getUnderReviewSpecialists,
    getApprovedSpecialists,
};
//# sourceMappingURL=specialist.service.js.map