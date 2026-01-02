import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

async function updatePlatformFees() {
  const tempDataSource = new DataSource({
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
  } catch (error) {
    console.error('❌ Error updating platform fees:', error);
    process.exit(1);
  }
}

updatePlatformFees();
