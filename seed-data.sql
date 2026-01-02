-- Sample Platform Fee Data
-- Run this SQL in your PostgreSQL database after running migrations

INSERT INTO platform_fee (id, uuid, tier_name, min_value, max_value, platform_fee_percentage, created_at, updated_at, deleted_at)
VALUES 
  (gen_random_uuid(), gen_random_uuid(), 'Bronze', 0, 1000, 5.00, NOW(), NOW(), false),
  (gen_random_uuid(), gen_random_uuid(), 'Silver', 1001, 5000, 7.50, NOW(), NOW(), false),
  (gen_random_uuid(), gen_random_uuid(), 'Gold', 5001, 10000, 10.00, NOW(), NOW(), false),
  (gen_random_uuid(), gen_random_uuid(), 'Platinum', 10001, 999999, 12.50, NOW(), NOW(), false);

-- Sample Specialist Data (for testing)
-- Note: Replace with actual UUIDs after first insert

-- Example: Create a sample specialist
-- INSERT INTO specialists (id, uuid, title, slug, description, base_price, platform_fee, final_price, duration_days, is_draft, average_rating, total_number_of_ratings, verification_status, is_verified, created_at, updated_at, deleted_at)
-- VALUES (gen_random_uuid(), gen_random_uuid(), 'Company Secretarial Services', 'company-secretarial-services', 'Complete company secretarial service package', 800.00, 40.00, 840.00, 14, false, 0, 0, 'pending', false, NOW(), NOW(), NULL);

-- Note: After creating a specialist via API, you can add service offerings and media through the API endpoints
