"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const provider_controller_1 = require("./provider.controller");
const authenticateUser_1 = __importDefault(require("../../middlewares/authenticateUser"));
const router = express_1.default.Router();
// Create provider (Admin/Super Admin only)
router.post('/create-provider', (0, authenticateUser_1.default)('ADMIN', 'SUPER_ADMIN'), provider_controller_1.ProviderController.createProvider);
// Get all providers
router.get('/', provider_controller_1.ProviderController.getAllProviders);
// Get provider by ID
router.get('/:id', provider_controller_1.ProviderController.getProviderById);
// Update provider (Admin/Super Admin/Provider themselves)
router.patch('/:id', (0, authenticateUser_1.default)('ADMIN', 'SUPER_ADMIN', 'PROVIDER'), provider_controller_1.ProviderController.updateProvider);
// Delete provider (Admin/Super Admin only)
router.delete('/:id', (0, authenticateUser_1.default)('ADMIN', 'SUPER_ADMIN'), provider_controller_1.ProviderController.deleteProvider);
exports.ProviderRoutes = router;
//# sourceMappingURL=provider.routes.js.map