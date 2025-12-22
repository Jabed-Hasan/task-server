"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_entity_1 = require("../entities/User.entity");
const Admin_entity_1 = require("../entities/Admin.entity");
const index_1 = __importDefault(require("./index"));
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: index_1.default.database_url,
    synchronize: false, // Set to false in production, use migrations instead
    logging: false,
    entities: [User_entity_1.User, Admin_entity_1.Admin],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: [],
});
// Initialize the data source
const initializeDatabase = async () => {
    try {
        await exports.AppDataSource.initialize();
        console.log('✅ Database connection established successfully');
    }
    catch (error) {
        console.error('❌ Error during Data Source initialization:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
exports.default = exports.AppDataSource;
//# sourceMappingURL=database.js.map