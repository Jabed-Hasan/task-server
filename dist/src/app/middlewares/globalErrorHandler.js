"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const status_codes_1 = require("http-status-codes/build/cjs/status-codes");
const globalErrorHandler = (err, req, res, next) => {
    res.status(status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || 'Something went wrong!',
        error: err,
    });
};
exports.default = globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map