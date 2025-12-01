-- Database Schema for Steal a Brainrot
-- PostgreSQL Database

-- Create brainrots table
CREATE TABLE IF NOT EXISTS brainrots (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10, 2),
    image_url TEXT,
    animation_data JSONB,
    description TEXT,
    game_id VARCHAR(50) NOT NULL DEFAULT '109983668079237',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, game_id)
);

-- Create categories table (if needed for normalization)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_brainrots_category ON brainrots(category);
CREATE INDEX IF NOT EXISTS idx_brainrots_game_id ON brainrots(game_id);
CREATE INDEX IF NOT EXISTS idx_brainrots_name ON brainrots(name);
CREATE INDEX IF NOT EXISTS idx_brainrots_updated_at ON brainrots(updated_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_brainrots_updated_at 
    BEFORE UPDATE ON brainrots
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some default categories (if needed)
INSERT INTO categories (name, description) VALUES
    ('Common', 'Common brainrots'),
    ('Rare', 'Rare brainrots'),
    ('Epic', 'Epic brainrots'),
    ('Legendary', 'Legendary brainrots')
ON CONFLICT (name) DO NOTHING;

