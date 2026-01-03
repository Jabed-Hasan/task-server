"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
const User_entity_1 = require("./src/entities/User.entity");
const Admin_entity_1 = require("./src/entities/Admin.entity");
const Provider_entity_1 = require("./src/entities/Provider.entity");
const Specialist_entity_1 = require("./src/entities/Specialist.entity");
const ServiceOffering_entity_1 = require("./src/entities/ServiceOffering.entity");
const PlatformFee_entity_1 = require("./src/entities/PlatformFee.entity");
const Media_entity_1 = require("./src/entities/Media.entity");
dotenv.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true, // Auto-sync enabled - ⚠️ Use only in development
    logging: true,
    entities: [User_entity_1.User, Admin_entity_1.Admin, Provider_entity_1.Provider, Specialist_entity_1.Specialist, ServiceOffering_entity_1.ServiceOffering, PlatformFee_entity_1.PlatformFee, Media_entity_1.Media],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: [],
});
//# sourceMappingURL=ormconfig.js.map