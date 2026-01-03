"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderService = void 0;
const database_1 = __importDefault(require("../../../config/database"));
const Provider_entity_1 = require("../../../entities/Provider.entity");
const User_entity_1 = require("../../../entities/User.entity");
const createProvider = async (email) => {
    const userRepository = database_1.default.getRepository(User_entity_1.User);
    const providerRepository = database_1.default.getRepository(Provider_entity_1.Provider);
    // Check if user exists
    const existingUser = await userRepository.findOne({
        where: { email },
    });
    if (!existingUser) {
        throw new Error('No user found with this email. Please create a user first.');
    }
    // Check if already a provider
    if (existingUser.role === User_entity_1.UserRole.PROVIDER) {
        throw new Error('This user is already assigned as a provider');
    }
    // Check if provider profile already exists
    const existingProvider = await providerRepository.findOne({
        where: { email },
    });
    if (existingProvider) {
        throw new Error('Provider profile already exists for this email');
    }
    // Update user role to PROVIDER
    existingUser.role = User_entity_1.UserRole.PROVIDER;
    await userRepository.save(existingUser);
    // Create provider profile
    const newProvider = providerRepository.create({
        name: existingUser.name || 'Provider',
        email: existingUser.email,
        contactNumber: existingUser.phoneNumber || null,
    });
    const result = await providerRepository.save(newProvider);
    return result;
};
const getAllProviders = async () => {
    const providerRepository = database_1.default.getRepository(Provider_entity_1.Provider);
    return await providerRepository.find({
        where: { isDeleted: false },
    });
};
const getProviderById = async (id) => {
    const providerRepository = database_1.default.getRepository(Provider_entity_1.Provider);
    return await providerRepository.findOne({
        where: { id, isDeleted: false },
    });
};
const getProviderByEmail = async (email) => {
    const providerRepository = database_1.default.getRepository(Provider_entity_1.Provider);
    return await providerRepository.findOne({
        where: { email, isDeleted: false },
    });
};
const updateProvider = async (id, payload) => {
    const providerRepository = database_1.default.getRepository(Provider_entity_1.Provider);
    const provider = await providerRepository.findOne({
        where: { id, isDeleted: false },
    });
    if (!provider) {
        throw new Error('Provider not found');
    }
    Object.assign(provider, payload);
    return await providerRepository.save(provider);
};
const deleteProvider = async (id) => {
    const providerRepository = database_1.default.getRepository(Provider_entity_1.Provider);
    const userRepository = database_1.default.getRepository(User_entity_1.User);
    const provider = await providerRepository.findOne({
        where: { id, isDeleted: false },
    });
    if (!provider) {
        throw new Error('Provider not found');
    }
    // Soft delete provider
    provider.isDeleted = true;
    await providerRepository.save(provider);
    // Revert user role back to USER
    const user = await userRepository.findOne({
        where: { email: provider.email },
    });
    if (user) {
        user.role = User_entity_1.UserRole.USER;
        await userRepository.save(user);
    }
    return provider;
};
exports.ProviderService = {
    createProvider,
    getAllProviders,
    getProviderById,
    getProviderByEmail,
    updateProvider,
    deleteProvider,
};
//# sourceMappingURL=provider.service.js.map