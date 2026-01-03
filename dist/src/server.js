"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const database_1 = require("./config/database");
async function main() {
    // Initialize database connection
    await (0, database_1.initializeDatabase)();
    const server = app_1.default.listen(config_1.default.port, () => {
        console.log(`Server is running on http://localhost:${config_1.default.port}`);
    });
}
main();
//# sourceMappingURL=server.js.map