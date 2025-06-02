-- Create an ADMIN user (password: admin)
INSERT INTO users (username, email, password_hash, role, created_at, updated_at)
VALUES (
  'admin',
  'admin@example.com',
  '$2a$10$7qGflXlU8.hM7xIh8qwoNeQCqMoxQaG98rZcYF5m7hxQN6nFGoYmK', -- BCrypt of "admin"
  'ADMIN',
  NOW(),
  NOW()
);

-- Example company
INSERT INTO companies (name, industry, website, city, country, created_at, updated_at)
VALUES ('Acme Corp', 'Manufacturing', 'https://acme.example.com', 'New York', 'USA', NOW(), NOW());

-- Example contact linked to Acme Corp (id = 1)
INSERT INTO contacts (company_id, first_name, last_name, email, phone, job_title, created_at, updated_at)
VALUES (1, 'Jane', 'Doe', 'jane.doe@acme.example.com', '555-1234', 'Procurement Manager', NOW(), NOW());

-- Example opportunity for contact (id = 1)
INSERT INTO opportunities (contact_id, title, amount, stage, close_date, created_at, updated_at)
VALUES (1, 'Big Order Q3', 50000.00, 'NEW', '2025-09-30', NOW(), NOW());

-- Example activity for the same contact & user (user_id = 1)
INSERT INTO activities (contact_id, user_id, type, subject, description, activity_date, due_date, completed, created_at, updated_at)
VALUES (1, 1, 'CALL', 'Introductory Call', 'Discussed potential Q3 order', NOW(), NOW() + INTERVAL '2 days', FALSE, NOW(), NOW());
