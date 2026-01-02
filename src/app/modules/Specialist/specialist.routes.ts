import express from 'express';
import { SpecialistController } from './specialist.controller';
import { SpecialistValidation } from './specialist.validation';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../middlewares/fileUpload';
import authenticateUser from '../../middlewares/authenticateUser';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// Get approved/live specialists (PUBLIC PAGE)
router.get('/live', SpecialistController.getApprovedSpecialists);

// Get specialist by ID (Public can view approved ones)
router.get('/:id', SpecialistController.getSpecialistById);

// ==================== PROVIDER ROUTES ====================

// Create specialist (Provider only)
// Supports both JSON (raw) and form-data (with file upload)
router.post(
  '/',
  authenticateUser('ADMIN','PROVIDER'),
  upload.array('media', 3),
  SpecialistController.createSpecialistWithUpload
);

// Update specialist (Provider only - can edit their own)
router.patch(
  '/:id',
  authenticateUser('ADMIN','PROVIDER'),
  upload.array('media', 3),
  SpecialistController.updateSpecialistWithUpload
);

// Publish specialist (Provider submits for review)
// is_draft: false → verification_status: 'under_review'
router.patch(
  '/:id/publish',
  authenticateUser('PROVIDER'),
  validateRequest(SpecialistValidation.publishSpecialistSchema),
  SpecialistController.publishSpecialist
);

// Get provider's draft specialists
router.get(
  '/provider/drafts',
  authenticateUser('PROVIDER','ADMIN'),
  SpecialistController.getDraftSpecialists
);

// Delete specialist (Provider can delete their own)
router.delete(
  '/:id',
  authenticateUser('PROVIDER','ADMIN'),
  SpecialistController.deleteSpecialist
);

// ==================== ADMIN ROUTES ====================

// Get all specialists (Admin can see all)
router.get(
  '/admin/all',
  authenticateUser('ADMIN', 'PROVIDER'),
  SpecialistController.getAllSpecialists
);

// Get specialists under review (Admin approval queue)
router.get(
  '/admin/under-review',
  authenticateUser('ADMIN', 'PROVIDER'),
  SpecialistController.getUnderReviewSpecialists
);

// Approve specialist (Admin only)
router.patch(
  '/:id/approve',
  authenticateUser('ADMIN',),
  SpecialistController.approveSpecialist
);

// Submit for review (Admin can manually move pending → under_review)
router.patch(
  '/:id/submit-review',
  authenticateUser('ADMIN', 'SUPER_ADMIN'),
  SpecialistController.submitForReview
);

// Reject specialist (Admin only)
router.patch(
  '/:id/reject',
  authenticateUser('ADMIN', 'SUPER_ADMIN'),
  SpecialistController.rejectSpecialist
);

// Get published specialists (Admin view)
router.get(
  '/admin/published',
  authenticateUser('ADMIN', 'SUPER_ADMIN'),
  SpecialistController.getPublishedSpecialists
);

export const SpecialistRoutes = router;
