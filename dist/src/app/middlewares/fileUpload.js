"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// 🎯 WHY MEMORY STORAGE?
// Vercel is serverless - no persistent disk storage
// We store files in memory temporarily, then upload to Cloudinary
// Memory is cleared after request completes
const storage = multer_1.default.memoryStorage();
// File validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'application/pdf',
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WEBP, MP4, and PDF allowed.'), false);
    }
};
// Export upload middleware
exports.upload = (0, multer_1.default)({
    storage: storage, // Memory storage (not disk!)
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});
//# sourceMappingURL=fileUpload.js.map