"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRouters = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const admin_validation_1 = require("./admin.validation");
const router = express_1.default.Router();
router.get('/', validateRequest_1.default, admin_controller_1.AdminController.getAllAdminsfromDB);
router.get('/:id', admin_controller_1.AdminController.getByIdFromDB);
router.patch('/:id', (0, validateRequest_1.default)(admin_validation_1.AdminValidationSchema.update), admin_controller_1.AdminController.updateIntoDB);
router.delete('/:id', admin_controller_1.AdminController.DeleteFromDB);
router.delete('/soft/:id', admin_controller_1.AdminController.SoftDeleteFromDB);
exports.AdminRouters = router;
//# sourceMappingURL=admin.routes.js.map