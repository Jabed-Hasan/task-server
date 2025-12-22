"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const CreateAdmin = async (req, res) => {
    try {
        const result = await user_service_1.userService.CreateAdmin(req.body);
        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: result,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err?.name || "Failed to create admin",
            error: err,
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
exports.UserController = {
    CreateAdmin,
    getUSerfromDB
};
//# sourceMappingURL=user.controller.js.map