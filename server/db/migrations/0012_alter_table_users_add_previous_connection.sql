-- Migration: Add previous_connection column to users table
ALTER TABLE users ADD COLUMN previous_connection timestamp with time zone;
