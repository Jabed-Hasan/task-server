"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const Admin_entity_1 = require("../../../entities/Admin.entity");
const User_entity_1 = require("../../../entities/User.entity");
const admin_constant_1 = require("./admin.constant");
const paginationHelper_1 = require("../../../helper/paginationHelper");
const database_1 = __importDefault(require("../../../config/database"));
const typeorm_1 = require("typeorm");
const getAllAdminsfromDB = async (params, options) => {
    const { limit, page, sortBy, sortOrder, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;
    const adminRepository = database_1.default.getRepository(Admin_entity_1.Admin);
    const whereConditions = [];
    // Search term condition
    if (params.searchTerm) {
        const searchConditions = admin_constant_1.adminSearchableFields.map((field) => ({
            [field]: (0, typeorm_1.ILike)(`%${params.searchTerm}%`)
        }));
        whereConditions.push(...searchConditions);
    }
    // Filter data conditions
    const baseCondition = { isDeleted: false };
    if (Object.keys(filterData).length > 0) {
        Object.keys(filterData).forEach((key) => {
            baseCondition[key] = filterData[key];
        });
    }
    // Build final where clause
    const finalWhere = whereConditions.length > 0
        ? whereConditions.map(cond => ({ ...cond, ...baseCondition }))
        : baseCondition;
    const [result, total] = await adminRepository.findAndCount({
        where: finalWhere,
        skip,
        take: limit,
        order: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder.toUpperCase() }
            : { createdAt: 'DESC' },
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result
    };
};
const getByIdFromDB = async (id) => {
    const adminRepository = database_1.default.getRepository(Admin_entity_1.Admin);
    const result = await adminRepository.findOne({
        where: {
            id,
            isDeleted: false,
        },
    });
    return result;
};
const updateIntoDB = async (id, data) => {
    const adminRepository = database_1.default.getRepository(Admin_entity_1.Admin);
    const admin = await adminRepository.findOne({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!admin) {
        throw new Error('Admin not found');
    }
    Object.assign(admin, data);
    const result = await adminRepository.save(admin);
    return result;
};
const DeleteFromDB = async (id) => {
    const adminRepository = database_1.default.getRepository(Admin_entity_1.Admin);
    const userRepository = database_1.default.getRepository(User_entity_1.User);
    const admin = await adminRepository.findOne({
        where: { id },
    });
    if (!admin) {
        throw new Error('Admin not found');
    }
    const result = await database_1.default.transaction(async (transactionalEntityManager) => {
        const admindeletedData = await transactionalEntityManager.remove(Admin_entity_1.Admin, admin);
        const user = await transactionalEntityManager.findOne(User_entity_1.User, {
            where: { email: admin.email },
        });
        if (user) {
            await transactionalEntityManager.remove(User_entity_1.User, user);
        }
        return admindeletedData;
    });
    return result;
};
const SoftDeleteFromDB = async (id) => {
    const adminRepository = database_1.default.getRepository(Admin_entity_1.Admin);
    const admin = await adminRepository.findOne({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!admin) {
        throw new Error('Admin not found');
    }
    const result = await database_1.default.transaction(async (transactionalEntityManager) => {
        admin.isDeleted = true;
        const admindeletedData = await transactionalEntityManager.save(Admin_entity_1.Admin, admin);
        const user = await transactionalEntityManager.findOne(User_entity_1.User, {
            where: { email: admin.email },
        });
        if (user) {
            user.status = User_entity_1.UserStatus.DELETED;
            await transactionalEntityManager.save(User_entity_1.User, user);
        }
        return admindeletedData;
    });
    return result;
};
exports.AdminService = {
    getAllAdminsfromDB,
    getByIdFromDB,
    updateIntoDB,
    DeleteFromDB,
    SoftDeleteFromDB,
};
//# sourceMappingURL=admin.service.js.map