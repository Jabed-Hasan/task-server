"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialistController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const specialist_service_1 = require("./specialist.service");
const specialist_constant_1 = require("./specialist.constant");
const cloudinary_1 = __importDefault(require("../../../config/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
// 🎯 UPLOAD MEDIA TO CLOUDINARY
// This endpoint handles file uploads and returns the file info
// to be used when creating/updating specialists
const uploadMedia = (0, catchAsync_1.default)(async (req, res) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        throw new Error('No files uploaded');
    }
    // Upload each file to Cloudinary
    const uploadPromises = req.files.map((file, index) => {
        return new Promise((resolve, reject) => {
            // Create upload stream to Cloudinary
            const uploadStream = cloudinary_1.default.uploader.upload_stream({
                folder: 'specialists', // Organize in Cloudinary folder
                resource_type: 'auto', // Auto-detect file type
            }, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
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
            });
            // Convert buffer to stream and upload
            streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
        });
    });
    // Wait for all uploads to complete
    const mediaData = await Promise.all(uploadPromises);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Files uploaded successfully to Cloudinary',
        data: mediaData,
    });
});
// Create specialist
const createSpecialist = (0, catchAsync_1.default)(async (req, res) => {
    const result = await specialist_service_1.SpecialistService.createSpecialist(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'Specialist created successfully',
        data: result,
    });
});
// 🎯 CREATE SPECIALIST WITH FILE UPLOAD (ONE-STEP)
// Handles both JSON and form-data with file uploads
const createSpecialistWithUpload = (0, catchAsync_1.default)(async (req, res) => {
    let specialistData;
    // Check if request has files (form-data) or just JSON
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        // Form-data with files: parse JSON from 'data' field
        specialistData = JSON.parse(req.body.data);
        // Upload files to Cloudinary
        const uploadPromises = req.files.map((file, index) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({
                    folder: 'specialists',
                    resource_type: 'auto',
                }, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    else {
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
                });
                streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
            });
        });
        const mediaData = await Promise.all(uploadPromises);
        // Merge uploaded media with specialist data
        specialistData = {
            ...specialistData,
            media: [...(specialistData.media || []), ...mediaData],
        };
    }
    else {
        // Regular JSON request (no files)
        specialistData = req.body;
    }
    // Create specialist
    const user = req.user;
    const result = await specialist_service_1.SpecialistService.createSpecialist(specialistData, {
        id: user?.id,
        name: user?.name
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'Specialist created successfully',
        data: result,
    });
});
// 🎯 UPDATE SPECIALIST WITH FILE UPLOAD
// Handles both JSON and form-data with file uploads
const updateSpecialistWithUpload = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    let updateData;
    // Check if data is sent as form-data (with or without files)
    if (req.body.data) {
        // Form-data: parse JSON from 'data' field
        updateData = typeof req.body.data === 'string'
            ? JSON.parse(req.body.data)
            : req.body.data;
        // Check if request has files
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            // Upload new files to Cloudinary
            const uploadPromises = req.files.map((file, index) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary_1.default.uploader.upload_stream({
                        folder: 'specialists',
                        resource_type: 'auto',
                    }, (error, result) => {
                        if (error) {
                            reject(error);
                        }
                        else {
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
                    });
                    streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
                });
            });
            const mediaData = await Promise.all(uploadPromises);
            // Merge uploaded media with existing data
            updateData = {
                ...updateData,
                media: [...(updateData.media || []), ...mediaData],
            };
        }
    }
    else {
        // Regular JSON request (no files)
        updateData = req.body;
    }
    // Update specialist
    const result = await specialist_service_1.SpecialistService.updateSpecialist(id, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Specialist updated successfully',
        data: result,
    });
});
// Get all specialists
const getAllSpecialists = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, specialist_constant_1.specialistFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await specialist_service_1.SpecialistService.getAllSpecialists(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Specialists fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
// Get specialist by ID
const getSpecialistById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await specialist_service_1.SpecialistService.getSpecialistById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Specialist fetched successfully',
        data: result,
    });
});
// Update specialist
const updateSpecialist = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await specialist_service_1.SpecialistService.updateSpecialist(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Specialist updated successfully',
        data: result,
    });
});
// Delete specialist
const deleteSpecialist = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    await specialist_service_1.SpecialistService.deleteSpecialist(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Specialist deleted successfully',
        data: null,
    });
});
// Publish specialist
const publishSpecialist = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { is_draft } = req.body;
    const result = await specialist_service_1.SpecialistService.publishSpecialist(id, is_draft);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: is_draft ? 'Specialist unpublished successfully' : 'Specialist published successfully',
        data: result,
    });
});
// Get draft specialists
const getDraftSpecialists = (0, catchAsync_1.default)(async (req, res) => {
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await specialist_service_1.SpecialistService.getDraftSpecialists(options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Draft specialists fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
// Get published specialists
const getPublishedSpecialists = (0, catchAsync_1.default)(async (req, res) => {
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await specialist_service_1.SpecialistService.getPublishedSpecialists(options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Published specialists fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
// Admin: Approve specialist
const approveSpecialist = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await specialist_service_1.SpecialistService.approveSpecialist(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Specialist approved successfully. It is now live on the public page.',
        data: result,
    });
});
// Admin: Reject specialist
const rejectSpecialist = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const result = await specialist_service_1.SpecialistService.rejectSpecialist(id, reason);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Specialist rejected.',
        data: result,
    });
});
// Admin: Get specialists under review
const getUnderReviewSpecialists = (0, catchAsync_1.default)(async (req, res) => {
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await specialist_service_1.SpecialistService.getUnderReviewSpecialists(options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Under review specialists fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
// Public: Get approved/live specialists
const getApprovedSpecialists = (0, catchAsync_1.default)(async (req, res) => {
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await specialist_service_1.SpecialistService.getApprovedSpecialists(options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Approved specialists fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
// Admin: Submit specialist for review (pending → under_review)
const submitForReview = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await specialist_service_1.SpecialistService.submitForReview(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Specialist status updated successfully',
        data: result,
    });
});
exports.SpecialistController = {
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
//# sourceMappingURL=specialist.controller.js.map