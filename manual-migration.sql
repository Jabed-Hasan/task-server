-- Manual Migration Template for Specialist Tables
-- Use this if automatic migration generation fails
-- Run this SQL directly in your PostgreSQL database

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create platform_fee table
CREATE TABLE IF NOT EXISTS platform_fee (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    tier_name VARCHAR(255) NOT NULL,
    min_value INTEGER NOT NULL,
    max_value INTEGER NOT NULL,
    platform_fee_percentage DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at BOOLEAN DEFAULT FALSE
);

-- Create specialists table
CREATE TABLE IF NOT EXISTS specialists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    average_rating DECIMAL(3,2) DEFAULT 0,
    is_draft BOOLEAN DEFAULT TRUE,
    total_number_of_ratings INTEGER DEFAULT 0,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2),
    final_price DECIMAL(10,2),
    verification_status VARCHAR(50) DEFAULT 'pending',
    is_verified BOOLEAN DEFAULT FALSE,
    duration_days INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Create service_offerings table
CREATE TABLE IF NOT EXISTS service_offerings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    specialists UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_service_offerings_specialist
        FOREIGN KEY (specialists) 
        REFERENCES specialists(id)
        ON DELETE CASCADE
);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    specialist_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    display_order INTEGER,
    mime_type VARCHAR(50) NOT NULL,
    media_type VARCHAR(50) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_media_specialist
        FOREIGN KEY (specialist_id) 
        REFERENCES specialists(id)
        ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_specialists_is_draft ON specialists(is_draft);
CREATE INDEX IF NOT EXISTS idx_specialists_slug ON specialists(slug);
CREATE INDEX IF NOT EXISTS idx_specialists_verification_status ON specialists(verification_status);
CREATE INDEX IF NOT EXISTS idx_specialists_base_price ON specialists(base_price);
CREATE INDEX IF NOT EXISTS idx_specialists_deleted_at ON specialists(deleted_at);
CREATE INDEX IF NOT EXISTS idx_service_offerings_specialists ON service_offerings(specialists);
CREATE INDEX IF NOT EXISTS idx_media_specialist_id ON media(specialist_id);
CREATE INDEX IF NOT EXISTS idx_media_display_order ON media(display_order);

-- Insert sample platform fee data
INSERT INTO platform_fee (tier_name, min_value, max_value, platform_fee_percentage, deleted_at)
VALUES 
    ('Bronze', 0, 1000, 5.00, FALSE),
    ('Silver', 1001, 5000, 7.50, FALSE),
    ('Gold', 5001, 10000, 10.00, FALSE),
    ('Platinum', 10001, 999999, 12.50, FALSE)
ON CONFLICT DO NOTHING;

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_specialists_updated_at BEFORE UPDATE ON specialists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_offerings_updated_at BEFORE UPDATE ON service_offerings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_fee_updated_at BEFORE UPDATE ON platform_fee
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify tables were created
SELECT 
    tablename, 
    schemaname 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('specialists', 'service_offerings', 'media', 'platform_fee')
ORDER BY tablename;

-- Show table structures
\d specialists
\d service_offerings
\d media
\d platform_fee
