import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { SpecialistService } from './specialist.service';
import { specialistFilterableFields } from './specialist.constant';
import cloudinary from '../../../config/cloudinary';
import streamifier from 'streamifier';

// 🎯 UPLOAD MEDIA TO CLOUDINARY
// This endpoint handles file uploads and returns the file info
// to be used when creating/updating specialists
const uploadMedia = catchAsync(async (req: Request, res: Response) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw new Error('No files uploaded');
  }

  // Upload each file to Cloudinary
  const uploadPromises = req.files.map((file: Express.Multer.File, index: number) => {
    return new Promise((resolve, reject) => {
      // Create upload stream to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'specialists', // Organize in Cloudinary folder
          resource_type: 'auto', // Auto-detect file type
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            // Return structured data
            resolve({
              file_name: file.originalname,
              file_url: result?.secure_url,
              cloudinary_public_id: result?.public_id,
              file_size: file.size,
              mime_type: file.mimetype,
              media_type: file.mimetype.startsWith('image')
                ? 'image'
                : file.mimetype.startsWith('video')
                ? 'video'
                : 'document',
              display_order: index + 1,
            });
          }
        }
      );

      // Convert buffer to stream and upload
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  });

  // Wait for all uploads to complete
  const mediaData = await Promise.all(uploadPromises);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Files uploaded successfully to Cloudinary',
    data: mediaData,
  });
});

// Create specialist
const createSpecialist = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialistService.createSpecialist(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Specialist created successfully',
    data: result,
  });
});

// 🎯 CREATE SPECIALIST WITH FILE UPLOAD (ONE-STEP)
// Handles both JSON and form-data with file uploads
const createSpecialistWithUpload = catchAsync(async (req: Request, res: Response) => {
  let specialistData;

  // Check if request has files (form-data) or just JSON
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    // Form-data with files: parse JSON from 'data' field
    specialistData = JSON.parse(req.body.data);

    // Upload files to Cloudinary
    const uploadPromises = req.files.map((file: Express.Multer.File, index: number) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'specialists',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                file_name: file.originalname,
                file_url: result?.secure_url,
                cloudinary_public_id: result?.public_id,
                file_size: file.size,
                mime_type: file.mimetype,
                media_type: file.mimetype.startsWith('image')
                  ? 'image'
                  : file.mimetype.startsWith('video')
                  ? 'video'
                  : 'document',
                display_order: index + 1,
              });
            }
          }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    });

    const mediaData = await Promise.all(uploadPromises);

    // Merge uploaded media with specialist data
    specialistData = {
      ...specialistData,
      media: [...(specialistData.media || []), ...mediaData],
    };
  } else {
    // Regular JSON request (no files)
    specialistData = req.body;
  }

  // Create specialist
  const user = (req as any).user;
  const result = await SpecialistService.createSpecialist(specialistData, {
    id: user?.id,
    name: user?.name
  });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Specialist created successfully',
    data: result,
  });
});

// 🎯 UPDATE SPECIALIST WITH FILE UPLOAD
// Handles both JSON and form-data with file uploads
const updateSpecialistWithUpload = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  let updateData: any;

  // Check if data is sent as form-data (with or without files)
  if (req.body.data) {
    // Form-data: parse JSON from 'data' field
    updateData = typeof req.body.data === 'string' 
      ? JSON.parse(req.body.data) 
      : req.body.data;

    // Check if request has files
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      // Upload new files to Cloudinary
      const uploadPromises = req.files.map((file: Express.Multer.File, index: number) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'specialists',
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  file_name: file.originalname,
                  file_url: result?.secure_url,
                  cloudinary_public_id: result?.public_id,
                  file_size: file.size,
                  mime_type: file.mimetype,
                  media_type: file.mimetype.startsWith('image')
                    ? 'image'
                    : file.mimetype.startsWith('video')
                    ? 'video'
                    : 'document',
                  display_order: (updateData.media?.length || 0) + index + 1,
                });
              }
            }
          );

          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      });

      const mediaData = await Promise.all(uploadPromises);

      // Merge uploaded media with existing data
      updateData = {
        ...updateData,
        media: [...(updateData.media || []), ...mediaData],
      };
    }
  } else {
    // Regular JSON request (no files)
    updateData = req.body;
  }

  // Update specialist
  const result = await SpecialistService.updateSpecialist(id, updateData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Specialist updated successfully',
    data: result,
  });
});

// Get all specialists
const getAllSpecialists = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, specialistFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await SpecialistService.getAllSpecialists(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Specialists fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

// Get specialist by ID
const getSpecialistById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SpecialistService.getSpecialistById(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Specialist fetched successfully',
    data: result,
  });
});

// Update specialist
const updateSpecialist = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SpecialistService.updateSpecialist(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Specialist updated successfully',
    data: result,
  });
});

// Delete specialist
const deleteSpecialist = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await SpecialistService.deleteSpecialist(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Specialist deleted successfully',
    data: null,
  });
});

// Publish specialist
const publishSpecialist = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { is_draft } = req.body;
  
  const result = await SpecialistService.publishSpecialist(id, is_draft);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: is_draft ? 'Specialist unpublished successfully' : 'Specialist published successfully',
    data: result,
  });
});

// Get draft specialists
const getDraftSpecialists = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await SpecialistService.getDraftSpecialists(options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Draft specialists fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

// Get published specialists
const getPublishedSpecialists = catchAsync(
  async (req: Request, res: Response) => {
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await SpecialistService.getPublishedSpecialists(options);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Published specialists fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

// Admin: Approve specialist
const approveSpecialist = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SpecialistService.approveSpecialist(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Specialist approved successfully. It is now live on the public page.',
    data: result,
  });
});

// Admin: Reject specialist
const rejectSpecialist = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const result = await SpecialistService.rejectSpecialist(id, reason);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Specialist rejected.',
    data: result,
  });
});

// Admin: Get specialists under review
const getUnderReviewSpecialists = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await SpecialistService.getUnderReviewSpecialists(options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Under review specialists fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

// Public: Get approved/live specialists
const getApprovedSpecialists = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await SpecialistService.getApprovedSpecialists(options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Approved specialists fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

// Admin: Submit specialist for review (pending → under_review)
const submitForReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SpecialistService.submitForReview(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Specialist status updated successfully',
    data: result,
  });
});

export const SpecialistController = {
  uploadMedia,
  createSpecialistWithUpload,
  updateSpecialistWithUpload,
  getAllSpecialists,
  getSpecialistById,
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
