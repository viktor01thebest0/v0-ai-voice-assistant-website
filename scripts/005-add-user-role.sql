-- Migration: Add role column to existing users table
-- This adds admin/client role functionality to the authentication system

-- Add role column with default value 'client'
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'client' 
CHECK (role IN ('admin', 'client'));

-- Create index for role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Optional: Set a specific user as admin (replace with actual email)
-- UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';

-- Verify the changes
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'role';
