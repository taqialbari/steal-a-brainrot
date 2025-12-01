-- Database Schema Migration v2
-- Adds support for Roblox Badges API integration
-- Adds: badge_id, rarity, metadata, data_source columns

-- ===========================================================================
-- MIGRATION STEPS
-- ===========================================================================

-- Step 1: Add new columns to brainrots table
-- ===========================================================================

-- Add badge_id column to track Roblox badge ID
ALTER TABLE brainrots
ADD COLUMN IF NOT EXISTS badge_id BIGINT;

-- Add rarity column for specific rarity tier (Common, Rare, Epic, etc.)
ALTER TABLE brainrots
ADD COLUMN IF NOT EXISTS rarity VARCHAR(50);

-- Add metadata column for storing badge statistics and extra data
ALTER TABLE brainrots
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Add data_source column to track where data came from
ALTER TABLE brainrots
ADD COLUMN IF NOT EXISTS data_source VARCHAR(50) DEFAULT 'badges_api';

-- ===========================================================================
-- Step 2: Add constraints
-- ===========================================================================

-- Add unique constraint on badge_id (but allow NULL for old data)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'unique_badge_id'
    ) THEN
        ALTER TABLE brainrots
        ADD CONSTRAINT unique_badge_id UNIQUE (badge_id);
    END IF;
END $$;

-- ===========================================================================
-- Step 3: Create indexes for better query performance
-- ===========================================================================

-- Index on badge_id for lookups
CREATE INDEX IF NOT EXISTS idx_brainrots_badge_id
ON brainrots(badge_id);

-- Index on rarity for filtering
CREATE INDEX IF NOT EXISTS idx_brainrots_rarity
ON brainrots(rarity);

-- Index on data_source for tracking
CREATE INDEX IF NOT EXISTS idx_brainrots_data_source
ON brainrots(data_source);

-- GIN index on metadata JSONB for querying nested data
CREATE INDEX IF NOT EXISTS idx_brainrots_metadata
ON brainrots USING GIN(metadata);

-- ===========================================================================
-- Step 4: Backfill existing data
-- ===========================================================================

-- Backfill rarity from category for existing records
UPDATE brainrots
SET rarity = category
WHERE rarity IS NULL AND category IS NOT NULL;

-- Set default data_source for existing records
UPDATE brainrots
SET data_source = 'manual'
WHERE data_source IS NULL OR data_source = '';

-- ===========================================================================
-- Step 5: Add comments for documentation
-- ===========================================================================

COMMENT ON COLUMN brainrots.badge_id IS 'Roblox badge ID from Badges API';
COMMENT ON COLUMN brainrots.rarity IS 'Rarity tier: Common, Rare, Epic, Legendary, Mythic, Brainrot God, Secret, OG';
COMMENT ON COLUMN brainrots.metadata IS 'JSONB field for storing badge statistics (awardedCount, winRate, etc.)';
COMMENT ON COLUMN brainrots.data_source IS 'Source of data: badges_api, scraper, manual';

-- ===========================================================================
-- Step 6: Create helper views (optional)
-- ===========================================================================

-- View for rarity statistics
CREATE OR REPLACE VIEW rarity_stats AS
SELECT
    rarity,
    COUNT(*) as count,
    AVG((metadata->>'winRate')::numeric) as avg_win_rate,
    AVG((metadata->>'awardedCount')::numeric) as avg_awarded_count,
    MIN((metadata->>'winRate')::numeric) as min_win_rate,
    MAX((metadata->>'winRate')::numeric) as max_win_rate
FROM brainrots
WHERE rarity IS NOT NULL
GROUP BY rarity
ORDER BY avg_win_rate ASC;

-- View for data source tracking
CREATE OR REPLACE VIEW data_source_stats AS
SELECT
    data_source,
    COUNT(*) as count,
    MAX(updated_at) as last_update,
    MIN(created_at) as first_created
FROM brainrots
GROUP BY data_source
ORDER BY count DESC;

-- ===========================================================================
-- VERIFICATION QUERIES
-- ===========================================================================

-- Check new columns exist
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'brainrots'
-- AND column_name IN ('badge_id', 'rarity', 'metadata', 'data_source');

-- Check indexes exist
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'brainrots'
-- AND indexname LIKE 'idx_brainrots_%';

-- Check data distribution
-- SELECT rarity, COUNT(*) as count
-- FROM brainrots
-- GROUP BY rarity
-- ORDER BY count DESC;

-- Check metadata structure
-- SELECT name, rarity, metadata
-- FROM brainrots
-- WHERE metadata IS NOT NULL
-- LIMIT 5;

-- ===========================================================================
-- ROLLBACK SCRIPT (if needed)
-- ===========================================================================

-- Uncomment below to rollback migration
-- DROP INDEX IF EXISTS idx_brainrots_badge_id;
-- DROP INDEX IF EXISTS idx_brainrots_rarity;
-- DROP INDEX IF EXISTS idx_brainrots_data_source;
-- DROP INDEX IF EXISTS idx_brainrots_metadata;
-- ALTER TABLE brainrots DROP CONSTRAINT IF EXISTS unique_badge_id;
-- ALTER TABLE brainrots DROP COLUMN IF EXISTS badge_id;
-- ALTER TABLE brainrots DROP COLUMN IF EXISTS rarity;
-- ALTER TABLE brainrots DROP COLUMN IF EXISTS metadata;
-- ALTER TABLE brainrots DROP COLUMN IF EXISTS data_source;
-- DROP VIEW IF EXISTS rarity_stats;
-- DROP VIEW IF EXISTS data_source_stats;

-- ===========================================================================
-- MIGRATION COMPLETE
-- ===========================================================================

-- Print success message
DO $$
BEGIN
    RAISE NOTICE '✅ Schema migration v2 completed successfully!';
    RAISE NOTICE '📊 New columns added: badge_id, rarity, metadata, data_source';
    RAISE NOTICE '📇 New indexes created for performance';
    RAISE NOTICE '📈 Views created: rarity_stats, data_source_stats';
END $$;
