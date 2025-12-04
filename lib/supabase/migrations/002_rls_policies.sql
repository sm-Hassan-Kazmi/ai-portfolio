-- Hassan's Terminal Portfolio - Row-Level Security Policies
-- This migration sets up RLS policies to secure data access

-- ============================================================================
-- ENABLE ROW-LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SECTIONS TABLE POLICIES
-- ============================================================================

-- Policy: Public read access to visible sections
-- Allows unauthenticated users to read sections where is_visible = true
CREATE POLICY "Public sections read access"
  ON sections
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

-- Policy: Admin full access to all sections
-- Allows authenticated admin users to perform all operations
CREATE POLICY "Admin full access to sections"
  ON sections
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================================================
-- SETTINGS TABLE POLICIES
-- ============================================================================

-- Policy: Public read access to settings
-- Allows anyone to read settings (for terminal themes, contact info, etc.)
CREATE POLICY "Public settings read access"
  ON settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Admin full access to settings
-- Allows authenticated admin users to modify settings
CREATE POLICY "Admin full access to settings"
  ON settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Policy: Users can read their own data
-- Allows authenticated users to read their own user record
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Policy: Users can update their own data
-- Allows authenticated users to update their own user record
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Policy: Admin can read all users
-- Allows admin users to read all user records
CREATE POLICY "Admin can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================================================
-- AUDIT_LOGS TABLE POLICIES
-- ============================================================================

-- Policy: Admin read-only access to audit logs
-- Allows authenticated admin users to read audit logs
-- No one can modify or delete audit logs (append-only)
CREATE POLICY "Admin read audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: System can insert audit logs
-- Allows the system to insert audit log entries
CREATE POLICY "System insert audit logs"
  ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- ANALYTICS_EVENTS TABLE POLICIES
-- ============================================================================

-- Policy: Anyone can insert analytics events
-- Allows both authenticated and anonymous users to log analytics
CREATE POLICY "Public insert analytics events"
  ON analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Admin read access to analytics
-- Allows authenticated admin users to read analytics data
CREATE POLICY "Admin read analytics events"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================================================

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS VARCHAR AS $$
BEGIN
  RETURN (
    SELECT role FROM users
    WHERE users.id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON POLICY "Public sections read access" ON sections IS 
  'Allows unauthenticated visitors to read only visible sections';

COMMENT ON POLICY "Admin full access to sections" ON sections IS 
  'Allows admin users to perform all CRUD operations on sections';

COMMENT ON POLICY "Public settings read access" ON settings IS 
  'Allows anyone to read settings for terminal themes and contact info';

COMMENT ON POLICY "Admin read audit logs" ON audit_logs IS 
  'Allows admin users to read audit logs for compliance and security monitoring';

COMMENT ON POLICY "Public insert analytics events" ON analytics_events IS 
  'Allows anyone to log analytics events for usage tracking';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- To verify RLS is enabled, run:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- To list all policies, run:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies WHERE schemaname = 'public';
