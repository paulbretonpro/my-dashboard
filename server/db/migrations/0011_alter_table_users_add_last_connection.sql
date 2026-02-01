-- Migration: Add last_connection column to users table
ALTER TABLE users ADD COLUMN last_connection timestamp with time zone;
