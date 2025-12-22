"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidationSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const update = zod_1.default.object({
    name: zod_1.default.string(),
    contactNumber: zod_1.default.string(),
});
exports.AdminValidationSchema = {
    update,
};
//# sourceMappingURL=admin.validation.js.map