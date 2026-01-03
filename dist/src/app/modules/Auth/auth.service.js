"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = __importDefault(require("../../../config/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtHelper_1 = require("../../../helper/jwtHelper");
const User_entity_1 = require("../../../entities/User.entity");
const config_1 = __importDefault(require("../../../config"));
const loginUser = async (payload) => {
    const userRepository = database_1.default.getRepository(User_entity_1.User);
    const userData = await userRepository.findOne({
        where: {
            email: payload.email,
            status: User_entity_1.UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new Error('User not found or not active');
    }
    const isCorrectPassword = await bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error('Incorrect password');
    }
    const accessToken = jwtHelper_1.JwtHelper.genererateToken({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelper_1.JwtHelper.genererateToken({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needsPasswordReset,
        name: userData.name || userData.email.split('@')[0], // Use email prefix if name is null
        email: userData.email,
        role: userData.role
    };
};
const refreshToken = async (token) => {
    let decodedToken;
    try {
        decodedToken = jwtHelper_1.JwtHelper.verifyToken(token, 'abcdefgh');
    }
    catch (err) {
        throw new Error('Invalid refresh token');
    }
    const userRepository = database_1.default.getRepository(User_entity_1.User);
    const isUserExist = await userRepository.findOne({
        where: {
            email: decodedToken.email,
            status: User_entity_1.UserStatus.ACTIVE,
        },
    });
    if (!isUserExist) {
        throw new Error('User not found or not active');
    }
    const newAccessToken = jwtHelper_1.JwtHelper.genererateToken({
        email: isUserExist.email,
        role: isUserExist.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
        needPasswordChange: isUserExist.needsPasswordReset,
    };
};
exports.AuthService = {
    loginUser,
    refreshToken,
};
//# sourceMappingURL=auth.service.js.map