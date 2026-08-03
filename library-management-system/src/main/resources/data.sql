-- Library Management System Data & Schema Initialization SQL Script

-- Ensure users role column can store long enum strings (e.g. PUBLISHER, ADMIN, USER)
ALTER TABLE users MODIFY COLUMN role VARCHAR(20);

-- Set default available copies for existing book records if missing
UPDATE books SET available_copies = 1 WHERE available_copies IS NULL;
