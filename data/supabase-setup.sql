-- ==========================================
-- SUPABASE SCHEMA SETUP, SEEDING & RLS POLICIES
-- Run this in your Supabase SQL Editor to create tables, seed users, and enable permissions.
-- ==========================================

-- 1. CREATE TABLES (IF NOT EXIST)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT
);

CREATE TABLE IF NOT EXISTS problems (
    id TEXT PRIMARY KEY,
    leetcode_number INTEGER NOT NULL,
    leetcode_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    category_number TEXT NOT NULL,
    pattern_number INTEGER NOT NULL,
    pattern_name TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    order_in_pattern INTEGER NOT NULL,
    order_overall INTEGER NOT NULL,
    is_stray BOOLEAN DEFAULT FALSE,
    is_truncated BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS completion (
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    problem_id TEXT REFERENCES problems(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, problem_id)
);

CREATE TABLE IF NOT EXISTS notes (
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    problem_id TEXT REFERENCES problems(id) ON DELETE CASCADE,
    note TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, problem_id)
);

CREATE TABLE IF NOT EXISTS bookmarks (
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    problem_id TEXT REFERENCES problems(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, problem_id)
);

CREATE TABLE IF NOT EXISTS revision (
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    problem_id TEXT REFERENCES problems(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'none',
    PRIMARY KEY (user_id, problem_id)
);

-- 2. SEED DEFAULT USERS
INSERT INTO users (id, name, avatar) VALUES 
('user-1', 'Me', '👨‍💻'),
('user-2', 'Partner', '👩‍💻')
ON CONFLICT (id) DO NOTHING;

-- 3. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE completion ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision ENABLE ROW LEVEL SECURITY;

-- 4. DROP EXISTING POLICIES (TO PREVENT CONFLICTS ON RERUN)
DROP POLICY IF EXISTS "Allow anon select on users" ON users;
DROP POLICY IF EXISTS "Allow anon insert on users" ON users;
DROP POLICY IF EXISTS "Allow anon update on users" ON users;

DROP POLICY IF EXISTS "Allow anon select on problems" ON problems;
DROP POLICY IF EXISTS "Allow anon insert on problems" ON problems;
DROP POLICY IF EXISTS "Allow anon update on problems" ON problems;

DROP POLICY IF EXISTS "Allow anon select on completion" ON completion;
DROP POLICY IF EXISTS "Allow anon insert on completion" ON completion;
DROP POLICY IF EXISTS "Allow anon update on completion" ON completion;
DROP POLICY IF EXISTS "Allow anon delete on completion" ON completion;

DROP POLICY IF EXISTS "Allow anon select on notes" ON notes;
DROP POLICY IF EXISTS "Allow anon insert on notes" ON notes;
DROP POLICY IF EXISTS "Allow anon update on notes" ON notes;
DROP POLICY IF EXISTS "Allow anon delete on notes" ON notes;

DROP POLICY IF EXISTS "Allow anon select on bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Allow anon insert on bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Allow anon delete on bookmarks" ON bookmarks;

DROP POLICY IF EXISTS "Allow anon select on revision" ON revision;
DROP POLICY IF EXISTS "Allow anon insert on revision" ON revision;
DROP POLICY IF EXISTS "Allow anon update on revision" ON revision;
DROP POLICY IF EXISTS "Allow anon delete on revision" ON revision;

-- 5. CREATE PERMISSIVE POLICIES FOR PUBLIC (ANON) ACCESS
-- USERS TABLE POLICIES
CREATE POLICY "Allow anon select on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow anon insert on users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on users" ON users FOR UPDATE USING (true) WITH CHECK (true);

-- PROBLEMS TABLE POLICIES
CREATE POLICY "Allow anon select on problems" ON problems FOR SELECT USING (true);
CREATE POLICY "Allow anon insert on problems" ON problems FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on problems" ON problems FOR UPDATE USING (true) WITH CHECK (true);

-- COMPLETION TABLE POLICIES
CREATE POLICY "Allow anon select on completion" ON completion FOR SELECT USING (true);
CREATE POLICY "Allow anon insert on completion" ON completion FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on completion" ON completion FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete on completion" ON completion FOR DELETE USING (true);

-- NOTES TABLE POLICIES
CREATE POLICY "Allow anon select on notes" ON notes FOR SELECT USING (true);
CREATE POLICY "Allow anon insert on notes" ON notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on notes" ON notes FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete on notes" ON notes FOR DELETE USING (true);

-- BOOKMARKS TABLE POLICIES
CREATE POLICY "Allow anon select on bookmarks" ON bookmarks FOR SELECT USING (true);
CREATE POLICY "Allow anon insert on bookmarks" ON bookmarks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon delete on bookmarks" ON bookmarks FOR DELETE USING (true);

-- REVISION TABLE POLICIES
CREATE POLICY "Allow anon select on revision" ON revision FOR SELECT USING (true);
CREATE POLICY "Allow anon insert on revision" ON revision FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on revision" ON revision FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete on revision" ON revision FOR DELETE USING (true);
