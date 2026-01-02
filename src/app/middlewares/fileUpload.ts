import multer from 'multer';
import path from 'path';

// 🎯 WHY MEMORY STORAGE?
// Vercel is serverless - no persistent disk storage
// We store files in memory temporarily, then upload to Cloudinary
// Memory is cleared after request completes

const storage = multer.memoryStorage();

// File validation
const fileFilter = (req: any, file: any, cb: any) => {
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
  } else {
    cb(
      new Error(
        'Invalid file type. Only JPEG, PNG, GIF, WEBP, MP4, and PDF allowed.'
      ),
      false
    );
  }
};

// Export upload middleware
export const upload = multer({
  storage: storage, // Memory storage (not disk!)
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});
