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
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
async function cleanDatabase() {
    const tempDataSource = new typeorm_1.DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: false, // Don't auto-sync in cleanup script
    });
    try {
        console.log('🧹 Starting database cleanup...');
        await tempDataSource.initialize();
        console.log('✅ Database connection established');
        // Drop tables with null constraint issues
        console.log('Dropping users and admins tables...');
        await tempDataSource.query('DROP TABLE IF EXISTS "users" CASCADE');
        await tempDataSource.query('DROP TABLE IF EXISTS "admins" CASCADE');
        // Drop custom types if they exist
        await tempDataSource.query('DROP TYPE IF EXISTS "UserRole" CASCADE');
        await tempDataSource.query('DROP TYPE IF EXISTS "UserStatus" CASCADE');
        await tempDataSource.query('DROP TYPE IF EXISTS "users_role_enum" CASCADE');
        await tempDataSource.query('DROP TYPE IF EXISTS "users_status_enum" CASCADE');
        console.log('✅ Tables dropped successfully');
        console.log('💡 Auto-sync will recreate them on next server start');
        await tempDataSource.destroy();
        console.log('🎉 Cleanup completed');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error during cleanup:', error);
        process.exit(1);
    }
}
cleanDatabase();
//# sourceMappingURL=clean-database.js.map