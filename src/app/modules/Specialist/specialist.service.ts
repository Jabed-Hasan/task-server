import { AppDataSource } from '../../../config/database';
import { Specialist, VerificationStatus } from '../../../entities/Specialist.entity';
import { Media } from '../../../entities/Media.entity';
import { PlatformFee } from '../../../entities/PlatformFee.entity';
import {
  ISpecialistFilters,
  ICreateSpecialistInput,
  IUpdateSpecialistInput,
} from './specialist.interface';
import { IPaginationOptions } from '../../interfaces/pagination';
import { IGenericResponse } from '../../interfaces/common';
import { paginationHelper } from '../../../helper/paginationHelper';
import { specialistSearchableFields } from './specialist.constant';
import { Like, Between, MoreThanOrEqual, LessThanOrEqual, In, IsNull } from 'typeorm';

const specialistRepository = AppDataSource.getRepository(Specialist);
const mediaRepository = AppDataSource.getRepository(Media);
const platformFeeRepository = AppDataSource.getRepository(PlatformFee);

// Helper function to generate slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

// Helper function to calculate platform fee
const calculatePlatformFee = async (basePrice: number): Promise<number> => {
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
const createSpecialist = async (
  payload: ICreateSpecialistInput
): Promise<Specialist> => {
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
    supported_company_types: specialistData.supported_company_types as any,
    additional_offerings: specialistData.additional_offerings as any,
    service_offerings_data: specialistData.service_offerings_data as any,
  } as any);

  const savedSpecialist = await specialistRepository.save(specialist) as unknown as Specialist;

  // Create media records if provided
  if (media && media.length > 0) {
    const mediaRecords = media.map((m) =>
      mediaRepository.create({
        ...m,
        specialist_id: savedSpecialist.id,
        uploaded_at: new Date(),
        mime_type: m.mime_type as any,
        media_type: m.media_type as any,
      })
    );
    await mediaRepository.save(mediaRecords);
  }

  // Return specialist with relations
  return await specialistRepository.findOne({
    where: { id: savedSpecialist.id },
    relations: ['service_offerings', 'media'],
  }) as Specialist;
};

// Get all specialists with filters and pagination
const getAllSpecialists = async (
  filters: ISpecialistFilters,
  options: IPaginationOptions
): Promise<IGenericResponse<Specialist[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, min_price, max_price, ...filterData } = filters;

  const whereConditions: any = {};

  // Search term
  if (searchTerm) {
    whereConditions.title = Like(`%${searchTerm}%`);
  }

  // Price range filter
  if (min_price && max_price) {
    whereConditions.base_price = Between(min_price, max_price);
  } else if (min_price) {
    whereConditions.base_price = MoreThanOrEqual(min_price);
  } else if (max_price) {
    whereConditions.base_price = LessThanOrEqual(max_price);
  }

  // Other filters
  Object.keys(filterData).forEach((key) => {
    if (filterData[key as keyof typeof filterData] !== undefined) {
      whereConditions[key] = filterData[key as keyof typeof filterData];
    }
  });

  // Exclude soft deleted
  whereConditions.deleted_at = IsNull();

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
const getSpecialistById = async (id: string): Promise<Specialist | null> => {
  const specialist = await specialistRepository.findOne({
    where: { id, deleted_at: IsNull() },
    relations: ['service_offerings', 'media'],
  });

  if (!specialist) {
    throw new Error('Specialist not found');
  }

  return specialist;
};

// Update specialist
const updateSpecialist = async (
  id: string,
  payload: IUpdateSpecialistInput
): Promise<Specialist> => {
  const specialist = await getSpecialistById(id);

  if (!specialist) {
    throw new Error('Specialist not found');
  }

  const { media, ...updateData } = payload;

  // Update slug if title is changed
  if (updateData.title) {
    (updateData as any).slug = generateSlug(updateData.title);
  }

  // Recalculate platform fee if base price is changed
  if (updateData.base_price) {
    const platformFee = await calculatePlatformFee(updateData.base_price);
    (updateData as any).platform_fee = platformFee;
    (updateData as any).final_price = updateData.base_price + platformFee;
  }

  // Update specialist
  await specialistRepository.update(id, updateData as any);

  // Update media if provided
  if (media) {
    // Delete existing media
    await mediaRepository.delete({ specialist_id: id });

    // Create new media
    if (media.length > 0) {
      const mediaRecords = media.map((m) =>
        mediaRepository.create({
          ...m,
          specialist_id: id,
          uploaded_at: new Date(),
          mime_type: m.mime_type as any,
          media_type: m.media_type as any,
        })
      );
      await mediaRepository.save(mediaRecords);
    }
  }

  // Return updated specialist
  return await getSpecialistById(id) as Specialist;
};

// Delete specialist (soft delete)
const deleteSpecialist = async (id: string): Promise<void> => {
  const specialist = await getSpecialistById(id);

  if (!specialist) {
    throw new Error('Specialist not found');
  }

  await specialistRepository.update(id, { deleted_at: new Date() });
};

// Publish/Unpublish specialist
// When publishing: is_draft → false, verification_status → 'under_review'
const publishSpecialist = async (
  id: string,
  isDraft: boolean
): Promise<Specialist> => {
  const specialist = await getSpecialistById(id);

  if (!specialist) {
    throw new Error('Specialist not found');
  }

  // When publishing (isDraft = false), set verification_status to 'under_review'
  const updateData: any = { is_draft: isDraft };
  
  if (!isDraft) {
    // Publishing: Set to under_review for admin approval
    updateData.verification_status = VerificationStatus.UNDER_REVIEW;
  } else {
    // Unpublishing/Drafting: Reset to pending
    updateData.verification_status = VerificationStatus.PENDING;
    updateData.is_verified = false;
  }

  await specialistRepository.update(id, updateData);

  return await getSpecialistById(id) as Specialist;
};

// Admin approve specialist
const approveSpecialist = async (id: string): Promise<Specialist> => {
  const specialist = await getSpecialistById(id);

  if (!specialist) {
    throw new Error('Specialist not found');
  }

  // Allow approval from any status except already approved
  if (specialist.verification_status === VerificationStatus.APPROVED) {
    throw new Error('Specialist is already approved');
  }

  await specialistRepository.update(id, {
    verification_status: VerificationStatus.APPROVED,
    is_verified: true,
    is_draft: false,
  });

  return await getSpecialistById(id) as Specialist;
};

// Admin reject specialist
const rejectSpecialist = async (id: string, reason?: string): Promise<Specialist> => {
  const specialist = await getSpecialistById(id);

  if (!specialist) {
    throw new Error('Specialist not found');
  }

  // Allow rejection from any status except already rejected
  if (specialist.verification_status === VerificationStatus.REJECTED) {
    throw new Error('Specialist is already rejected');
  }

  await specialistRepository.update(id, {
    verification_status: VerificationStatus.REJECTED,
    is_verified: false,
  });

  return await getSpecialistById(id) as Specialist;
};

// Admin: Submit specialist for review (pending → under_review)
const submitForReview = async (id: string): Promise<Specialist> => {
  const specialist = await getSpecialistById(id);

  if (!specialist) {
    throw new Error('Specialist not found');
  }

  if (specialist.verification_status === VerificationStatus.UNDER_REVIEW) {
    throw new Error('Specialist is already under review');
  }

  await specialistRepository.update(id, {
    verification_status: VerificationStatus.UNDER_REVIEW,
    is_draft: false,
  });

  return await getSpecialistById(id) as Specialist;
};

// Get specialists under review (for Admin)
const getUnderReviewSpecialists = async (
  options: IPaginationOptions
): Promise<IGenericResponse<Specialist[]>> => {
  return await getAllSpecialists({ verification_status: 'under_review' } as any, options);
};

// Get approved/live specialists (for public page)
const getApprovedSpecialists = async (
  options: IPaginationOptions
): Promise<IGenericResponse<Specialist[]>> => {
  return await getAllSpecialists({ verification_status: 'approved', is_verified: true } as any, options);
};

// Get draft specialists
const getDraftSpecialists = async (
  options: IPaginationOptions
): Promise<IGenericResponse<Specialist[]>> => {
  return await getAllSpecialists({ is_draft: true }, options);
};

// Get published specialists
const getPublishedSpecialists = async (
  options: IPaginationOptions
): Promise<IGenericResponse<Specialist[]>> => {
  return await getAllSpecialists({ is_draft: false }, options);
};

export const SpecialistService = {
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
