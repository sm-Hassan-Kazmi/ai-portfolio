-- Hassan's Terminal Portfolio - Initial Database Schema
-- This migration creates the core tables for the portfolio system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SECTIONS TABLE
-- Stores all portfolio content (skills, experience, projects, certifications, achievements)
-- ============================================================================
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('skill', 'experience', 'project', 'certification', 'achievement')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  image_url TEXT,
  start_date DATE,
  end_date DATE,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_sections_type ON sections(type);
CREATE INDEX IF NOT EXISTS idx_sections_order ON sections(display_order);
CREATE INDEX IF NOT EXISTS idx_sections_visible ON sections(is_visible);
CREATE INDEX IF NOT EXISTS idx_sections_featured ON sections(is_featured);
CREATE INDEX IF NOT EXISTS idx_sections_type_visible ON sections(type, is_visible);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sections_updated_at
  BEFORE UPDATE ON sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SETTINGS TABLE
-- Stores global configuration and settings
-- ============================================================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for key lookups
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- Create trigger for settings updated_at
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- USERS TABLE
-- Stores admin user accounts
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  two_fa_enabled BOOLEAN DEFAULT false,
  two_fa_secret TEXT,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================================
-- AUDIT_LOGS TABLE
-- Tracks all administrative actions for security and compliance
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  table_name VARCHAR(50) NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- ============================================================================
-- ANALYTICS_EVENTS TABLE
-- Stores analytics data for portfolio usage tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  session_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE sections IS 'Portfolio content sections including skills, experience, projects, certifications, and achievements';
COMMENT ON TABLE settings IS 'Global configuration and settings for the portfolio';
COMMENT ON TABLE users IS 'Admin user accounts for content management';
COMMENT ON TABLE audit_logs IS 'Audit trail of all administrative actions';
COMMENT ON TABLE analytics_events IS 'Analytics events for tracking portfolio usage';

COMMENT ON COLUMN sections.metadata IS 'JSON metadata specific to each section type (see design doc for schemas)';
COMMENT ON COLUMN sections.display_order IS 'Order in which sections should be displayed (lower numbers first)';
COMMENT ON COLUMN sections.is_featured IS 'Whether this section should be highlighted as featured content';
COMMENT ON COLUMN sections.is_visible IS 'Whether this section is visible to public visitors (RLS enforced)';
