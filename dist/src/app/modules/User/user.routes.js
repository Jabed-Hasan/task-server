"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const authenticateUser_1 = __importDefault(require("../../middlewares/authenticateUser"));
const router = express_1.default.Router();
// Define user-related routes here
router.post('/create-admin', (0, authenticateUser_1.default)('ADMIN', 'SUPER_ADMIN'), user_controller_1.UserController.CreateAdmin);
router.post('/', user_controller_1.UserController.createUser);
router.get('/all', user_controller_1.UserController.getUSerfromDB);
// Change user status (ACTIVE/BLOCKED)
router.patch('/:id/status', (0, authenticateUser_1.default)('ADMIN', 'SUPER_ADMIN'), user_controller_1.UserController.changeUserStatus);
exports.UserRouter = router;
//# sourceMappingURL=user.routes.js.map