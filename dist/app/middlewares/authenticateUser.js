"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwtHelper_1 = require("../../helper/jwtHelper");
const config_1 = __importDefault(require("../../config"));
const authenticateUser = (...roles) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new Error('No token provided, Unauthorized!');
            }
            const verifiedUser = await jwtHelper_1.JwtHelper.verifyToken(token, config_1.default.jwt.jwt_secret);
            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new Error('Forbidden: You do not have access to this resource');
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.default = authenticateUser;
//# sourceMappingURL=authenticateUser.js.map