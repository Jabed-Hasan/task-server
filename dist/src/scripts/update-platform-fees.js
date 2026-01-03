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
async function updatePlatformFees() {
    const tempDataSource = new typeorm_1.DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: false,
    });
    try {
        console.log('🔄 Updating platform fee percentages...');
        await tempDataSource.initialize();
        console.log('✅ Database connection established');
        // Delete old fee tiers
        await tempDataSource.query('DELETE FROM platform_fee');
        // Insert new fee tiers matching your UI design (30% for 1,001-5,000 range)
        await tempDataSource.query(`
      INSERT INTO platform_fee (uuid, tier_name, min_value, max_value, platform_fee_percentage) VALUES
      (uuid_generate_v4(), 'Tier 1 - Basic', 0, 1000, 20.00),
      (uuid_generate_v4(), 'Tier 2 - Standard', 1001, 5000, 30.00),
      (uuid_generate_v4(), 'Tier 3 - Premium', 5001, 10000, 25.00),
      (uuid_generate_v4(), 'Tier 4 - Enterprise', 10001, 999999999, 15.00)
    `);
        console.log('✅ Platform fee tiers updated successfully:');
        console.log('  - Tier 1 (Basic): RM 0-1,000 → 20%');
        console.log('  - Tier 2 (Standard): RM 1,001-5,000 → 30% ⭐ (Matches your UI)');
        console.log('  - Tier 3 (Premium): RM 5,001-10,000 → 25%');
        console.log('  - Tier 4 (Enterprise): RM 10,001+ → 15%');
        console.log('');
        console.log('Example: RM 1,800 → Fee: RM 540 (30%) → Total: RM 2,340 ✅');
        await tempDataSource.destroy();
        console.log('🎉 Update completed');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error updating platform fees:', error);
        process.exit(1);
    }
}
updatePlatformFees();
//# sourceMappingURL=update-platform-fees.js.map