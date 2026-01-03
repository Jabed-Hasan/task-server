"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderController = void 0;
const provider_service_1 = require("./provider.service");
const createProvider = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }
        const result = await provider_service_1.ProviderService.createProvider(email);
        res.status(201).json({
            success: true,
            message: 'Provider created successfully',
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err?.message || 'Failed to create provider',
        });
    }
};
const getAllProviders = async (req, res) => {
    try {
        const result = await provider_service_1.ProviderService.getAllProviders();
        res.status(200).json({
            success: true,
            message: 'Providers retrieved successfully',
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err?.message || 'Failed to get providers',
        });
    }
};
const getProviderById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await provider_service_1.ProviderService.getProviderById(id);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Provider not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Provider retrieved successfully',
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err?.message || 'Failed to get provider',
        });
    }
};
const updateProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await provider_service_1.ProviderService.updateProvider(id, req.body);
        res.status(200).json({
            success: true,
            message: 'Provider updated successfully',
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err?.message || 'Failed to update provider',
        });
    }
};
const deleteProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await provider_service_1.ProviderService.deleteProvider(id);
        res.status(200).json({
            success: true,
            message: 'Provider deleted successfully',
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err?.message || 'Failed to delete provider',
        });
    }
};
exports.ProviderController = {
    createProvider,
    getAllProviders,
    getProviderById,
    updateProvider,
    deleteProvider,
};
//# sourceMappingURL=provider.controller.js.map