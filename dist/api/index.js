"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const app_1 = __importDefault(require("../src/app"));
const database_1 = require("../src/config/database");
// Initialize database connection
(0, database_1.initializeDatabase)().catch(err => {
    console.error('Database initialization failed:', err);
});
// Export the Express app for Vercel serverless
exports.default = app_1.default;
//# sourceMappingURL=index.js.map