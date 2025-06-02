-- src/main/resources/data.sql

-- ===== USERS =====
INSERT INTO users (username, email, password_hash, role, created_at, updated_at)
VALUES
    ('admin', 'admin@example.com',
     '$2a$10$7qGflXlU8.hM7xIh8qwoNeQCqMoxQaG98rZcYF5m7hxQN6nFGoYmK',
     'ADMIN', NOW(), NOW());
-- (BCrypt of “admin”)

INSERT INTO users (username, email, password_hash, role, created_at, updated_at)
VALUES
    ('sales1', 'sales1@example.com',
     '$2a$10$eX4Yh9Iq6KnQZP2oIT7hiOvZC1k3G8ZJ9QqkOzR4YpRZbXk/c7L9u',
     'SALES', NOW(), NOW());
-- (BCrypt of “password123”)

-- ===== COMPANIES =====
INSERT INTO companies (name, industry, website, address_line1, city, state, postal_code, country, created_at, updated_at)
VALUES
    ('Acme Corp', 'Manufacturing', 'https://acme.example.com', '123 Elm St', 'Metropolis', 'NY', '10001', 'USA', NOW(), NOW());

INSERT INTO companies (name, industry, website, address_line1, city, state, postal_code, country, created_at, updated_at)
VALUES
    ('Globex Inc', 'Technology', 'https://globex.example.com', '456 Oak Ave', 'Gotham', 'NJ', '07097', 'USA', NOW(), NOW());

-- ===== CONTACTS =====
INSERT INTO contacts (company_id, first_name, last_name, email, phone, job_title, created_at, updated_at)
VALUES
    (1, 'Jane', 'Doe', 'jane.doe@acme.example.com', '555-1234', 'Procurement Manager', NOW(), NOW());

INSERT INTO contacts (company_id, first_name, last_name, email, phone, job_title, created_at, updated_at)
VALUES
    (2, 'John', 'Smith', 'john.smith@globex.example.com', '555-5678', 'CTO', NOW(), NOW());

-- ===== OPPORTUNITIES =====
INSERT INTO opportunities (contact_id, title, amount, stage, close_date, created_at, updated_at)
VALUES
    (1, 'Q3 Widget Order', 25000.00, 'NEW', '2025-09-30', NOW(), NOW());

INSERT INTO opportunities (contact_id, title, amount, stage, close_date, created_at, updated_at)
VALUES
    (2, 'Platform Upgrade Project', 75000.00, 'PROPOSAL', '2025-11-15', NOW(), NOW());

-- ===== ACTIVITIES =====
INSERT INTO activities (contact_id, user_id, type, subject, description, activity_date, due_date, completed, created_at, updated_at)
VALUES
    (1, 1, 'CALL', 'Introductory Call', 'Discussed widget specs and pricing', NOW(), NOW() + INTERVAL '2 days', FALSE, NOW(), NOW());

INSERT INTO activities (contact_id, user_id, type, subject, description, activity_date, due_date, completed, created_at, updated_at)
VALUES
    (2, 2, 'MEETING', 'Tech Review', 'Reviewed platform requirements', NOW(), NOW() + INTERVAL '3 days', FALSE, NOW(), NOW());
