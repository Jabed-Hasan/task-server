"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
async function seedPlatformFees() {
    try {
        console.log('🌱 Starting platform fee seeding...');
        await database_1.AppDataSource.initialize();
        console.log('✅ Database connection established');
        // Check if data already exists
        const existingFees = await database_1.AppDataSource.query('SELECT COUNT(*) FROM platform_fee WHERE deleted_at = false');
        if (existingFees[0].count > 0) {
            console.log('⚠️  Platform fees already exist, skipping seed');
            await database_1.AppDataSource.destroy();
            return;
        }
        // Insert platform fee tiers
        await database_1.AppDataSource.query(`
      INSERT INTO platform_fee (uuid, tier_name, min_value, max_value, platform_fee_percentage) VALUES
      (uuid_generate_v4(), 'Bronze', 0, 1000, 5.00),
      (uuid_generate_v4(), 'Silver', 1001, 5000, 7.50),
      (uuid_generate_v4(), 'Gold', 5001, 10000, 10.00),
      (uuid_generate_v4(), 'Platinum', 10001, 999999999, 12.50)
    `);
        console.log('✅ Platform fee tiers inserted successfully:');
        console.log('  - Bronze: 0-1000 (5%)');
        console.log('  - Silver: 1001-5000 (7.5%)');
        console.log('  - Gold: 5001-10000 (10%)');
        console.log('  - Platinum: 10001+ (12.5%)');
        await database_1.AppDataSource.destroy();
        console.log('🎉 Seeding completed successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding platform fees:', error);
        process.exit(1);
    }
}
seedPlatformFees();
//# sourceMappingURL=seed-platform-fees.js.map