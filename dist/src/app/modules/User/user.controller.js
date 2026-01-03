"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const CreateAdmin = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }
        const result = await user_service_1.userService.CreateAdmin(email);
        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err?.message || "Failed to create admin",
            error: err?.message,
        });
    }
};
const getUSerfromDB = async (req, res) => {
    try {
        const result = await user_service_1.userService.getUserfromDB();
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: result,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err?.name || "Failed to fetch users",
            error: err.message,
        });
    }
};
const createUser = async (req, res) => {
    try {
        const result = await user_service_1.userService.createUser(req.body);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err?.message || "Failed to create user",
            error: err?.message,
        });
    }
};
const changeUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required",
            });
        }
        const result = await user_service_1.userService.changeUserStatus(id, status);
        res.status(200).json({
            success: true,
            message: `User status changed to ${status} successfully`,
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err?.message || "Failed to change user status",
            error: err?.message,
        });
    }
};
exports.UserController = {
    CreateAdmin,
    getUSerfromDB,
    createUser,
    changeUserStatus
};
//# sourceMappingURL=user.controller.js.map