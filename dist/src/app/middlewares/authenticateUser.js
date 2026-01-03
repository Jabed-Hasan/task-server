"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwtHelper_1 = require("../../helper/jwtHelper");
const config_1 = __importDefault(require("../../config"));
const database_1 = __importDefault(require("../../config/database"));
const User_entity_1 = require("../../entities/User.entity");
const authenticateUser = (...roles) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw new Error('No token provided, Unauthorized!');
            }
            // Extract token (remove 'Bearer ' prefix if present)
            const token = authHeader.startsWith('Bearer ')
                ? authHeader.substring(7)
                : authHeader;
            const verifiedUser = await jwtHelper_1.JwtHelper.verifyToken(token, config_1.default.jwt.jwt_secret);
            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new Error('Forbidden: You do not have access to this resource');
            }
            // Fetch full user details from database
            const userRepository = database_1.default.getRepository(User_entity_1.User);
            const user = await userRepository.findOne({
                where: { email: verifiedUser.email }
            });
            // Attach user info to request
            req.user = {
                id: user?.id,
                email: verifiedUser.email,
                name: user?.name || verifiedUser.email.split('@')[0],
                role: verifiedUser.role
            };
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.default = authenticateUser;
//# sourceMappingURL=authenticateUser.js.map