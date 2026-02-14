-- Initial data

-- 1. Materials Master Data
CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL, -- Para búsquedas fáciles (ej: 'plastic')
    co2_factor DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Waste Registrations
CREATE TABLE IF NOT EXISTS waste_registrations (
    id SERIAL PRIMARY KEY,
    material_id INT REFERENCES materials(id),
    weight DECIMAL(10,2) NOT NULL,
    calculated_co2 DECIMAL(10,2),
    calculated_tax DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Contracts (Business Logic Result)
CREATE TABLE IF NOT EXISTS contracts (
    id SERIAL PRIMARY KEY,
    registration_id INT REFERENCES waste_registrations(id),
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    terms TEXT,
    expiry_date DATE,
    signed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Master Data
INSERT INTO materials (name, slug, co2_factor, tax_rate) VALUES
('Plastic', 'plastic', 2.50, 0.15),
('Glass', 'glass', 1.20, 0.05),
('Metal', 'metal', 4.00, 0.25),
('Paper', 'paper', 0.80, 0.02);