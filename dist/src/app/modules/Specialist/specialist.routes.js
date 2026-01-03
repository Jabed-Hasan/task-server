"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialistRoutes = void 0;
const express_1 = __importDefault(require("express"));
const specialist_controller_1 = require("./specialist.controller");
const specialist_validation_1 = require("./specialist.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const fileUpload_1 = require("../../middlewares/fileUpload");
const authenticateUser_1 = __importDefault(require("../../middlewares/authenticateUser"));
const router = express_1.default.Router();
// ==================== PUBLIC ROUTES ====================
// Get approved/live specialists (PUBLIC PAGE)
router.get('/live', specialist_controller_1.SpecialistController.getApprovedSpecialists);
// Get specialist by ID (Public can view approved ones)
router.get('/:id', specialist_controller_1.SpecialistController.getSpecialistById);
// ==================== PROVIDER ROUTES ====================
// Create specialist (Provider only)
// Supports both JSON (raw) and form-data (with file upload)
router.post('/', (0, authenticateUser_1.default)('ADMIN', 'PROVIDER'), fileUpload_1.upload.array('media', 3), specialist_controller_1.SpecialistController.createSpecialistWithUpload);
// Update specialist (Provider only - can edit their own)
router.patch('/:id', (0, authenticateUser_1.default)('ADMIN', 'PROVIDER'), fileUpload_1.upload.array('media', 3), specialist_controller_1.SpecialistController.updateSpecialistWithUpload);
// Publish specialist (Provider submits for review)
// is_draft: false → verification_status: 'under_review'
router.patch('/:id/publish', (0, authenticateUser_1.default)('PROVIDER'), (0, validateRequest_1.default)(specialist_validation_1.SpecialistValidation.publishSpecialistSchema), specialist_controller_1.SpecialistController.publishSpecialist);
// Get provider's draft specialists
router.get('/provider/drafts', (0, authenticateUser_1.default)('PROVIDER', 'ADMIN'), specialist_controller_1.SpecialistController.getDraftSpecialists);
// Delete specialist (Provider can delete their own)
router.delete('/:id', (0, authenticateUser_1.default)('PROVIDER', 'ADMIN'), specialist_controller_1.SpecialistController.deleteSpecialist);
// ==================== ADMIN ROUTES ====================
// Get all specialists (Admin can see all)
router.get('/admin/all', (0, authenticateUser_1.default)('ADMIN', 'PROVIDER'), specialist_controller_1.SpecialistController.getAllSpecialists);
// Get specialists under review (Admin approval queue)
router.get('/admin/under-review', (0, authenticateUser_1.default)('ADMIN', 'PROVIDER'), specialist_controller_1.SpecialistController.getUnderReviewSpecialists);
// Approve specialist (Admin only)
router.patch('/:id/approve', (0, authenticateUser_1.default)('ADMIN'), specialist_controller_1.SpecialistController.approveSpecialist);
// Submit for review (Admin can manually move pending → under_review)
router.patch('/:id/submit-review', (0, authenticateUser_1.default)('ADMIN', 'SUPER_ADMIN'), specialist_controller_1.SpecialistController.submitForReview);
// Reject specialist (Admin only)
router.patch('/:id/reject', (0, authenticateUser_1.default)('ADMIN', 'SUPER_ADMIN'), specialist_controller_1.SpecialistController.rejectSpecialist);
// Get published specialists (Admin view)
router.get('/admin/published', (0, authenticateUser_1.default)('ADMIN', 'SUPER_ADMIN'), specialist_controller_1.SpecialistController.getPublishedSpecialists);
exports.SpecialistRoutes = router;
//# sourceMappingURL=specialist.routes.js.map