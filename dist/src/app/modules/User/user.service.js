"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const User_entity_1 = require("../../../entities/User.entity");
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../../../config/database"));
const User_entity_2 = require("../../../entities/User.entity");
const CreateAdmin = async (email) => {
    const userRepository = database_1.default.getRepository(User_entity_2.User);
    // Check if user exists with this email
    const existingUser = await userRepository.findOne({
        where: { email }
    });
    if (!existingUser) {
        throw new Error('No user found with this email. Please create a user first.');
    }
    // Check if user is already an admin
    if (existingUser.role === User_entity_1.UserRole.ADMIN || existingUser.role === User_entity_1.UserRole.SUPER_ADMIN) {
        throw new Error('This user is already assigned as an admin');
    }
    // Update user role to ADMIN
    existingUser.role = User_entity_1.UserRole.ADMIN;
    existingUser.updatedAt = new Date();
    const result = await userRepository.save(existingUser);
    // Remove password from response
    const { password, ...userWithoutPassword } = result;
    return userWithoutPassword;
};
const getUserfromDB = async () => {
    const userRepository = database_1.default.getRepository(User_entity_2.User);
    const result = await userRepository.find();
    return result;
};
const createUser = async (data) => {
    const userRepository = database_1.default.getRepository(User_entity_2.User);
    // Check if user already exists
    const existingUser = await userRepository.findOne({
        where: { email: data.email }
    });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    const now = new Date();
    const userData = {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phoneNumber: data.phoneNumber,
        role: data.role || User_entity_1.UserRole.USER,
        needsPasswordReset: data.needsPasswordReset || false,
        status: data.status || 'ACTIVE',
        createdAt: now,
        updatedAt: now,
    };
    const user = userRepository.create(userData);
    const result = await userRepository.save(user);
    // Remove password from response
    const { password, ...userWithoutPassword } = result;
    return userWithoutPassword;
};
// Change user account status (ACTIVE/BLOCKED)
const changeUserStatus = async (userId, status) => {
    const userRepository = database_1.default.getRepository(User_entity_2.User);
    const user = await userRepository.findOne({
        where: { id: userId }
    });
    if (!user) {
        throw new Error('User not found');
    }
    // Validate status
    const validStatuses = ['ACTIVE', 'BLOCKED', 'DELETED'];
    if (!validStatuses.includes(status)) {
        throw new Error('Invalid status. Must be ACTIVE, BLOCKED, or DELETED');
    }
    user.status = status;
    user.updatedAt = new Date();
    const result = await userRepository.save(user);
    // Remove password from response
    const { password, ...userWithoutPassword } = result;
    return userWithoutPassword;
};
exports.userService = {
    CreateAdmin,
    getUserfromDB,
    createUser,
    changeUserStatus,
};
//# sourceMappingURL=user.service.js.map