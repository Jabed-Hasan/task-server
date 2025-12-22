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
const Admin_entity_1 = require("../../../entities/Admin.entity");
const CreateAdmin = async (data) => {
    const hashedpassword = await bcrypt_1.default.hash(data.password, 10);
    const userData = {
        email: data.admin.email,
        password: hashedpassword,
        role: User_entity_1.UserRole.ADMIN,
    };
    // Use TypeORM transaction
    const result = await database_1.default.transaction(async (transactionalEntityManager) => {
        // 1️⃣ Create user first
        const user = transactionalEntityManager.create(User_entity_2.User, userData);
        const createdUser = await transactionalEntityManager.save(user);
        // 2️⃣ Create admin linked to the user (linked by email)
        const admin = transactionalEntityManager.create(Admin_entity_1.Admin, data.admin);
        const createdAdmin = await transactionalEntityManager.save(admin);
        return createdAdmin;
    });
    return result;
};
const getUserfromDB = async () => {
    const userRepository = database_1.default.getRepository(User_entity_2.User);
    const result = await userRepository.find();
    return result;
};
exports.userService = {
    CreateAdmin,
    getUserfromDB,
};
//# sourceMappingURL=user.service.js.map