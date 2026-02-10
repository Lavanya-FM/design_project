-- Fit & Flare Studio - Database Schema
-- Updated to support multi-stakeholder flow (Customer, Tailor, Designer, Merchant)

-- Enable UUID extension for secure IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
-- Stores customer, admin, tailor, designer, and merchant information
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'tailor', 'designer', 'merchant')),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Measurements Table
-- Stores user body measurements. A user can have multiple measurement profiles.
CREATE TABLE measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    profile_name VARCHAR(50) NOT NULL DEFAULT 'My Measurements',
    
    -- Core Measurements (in inches)
    bust NUMERIC(5, 2) NOT NULL,
    waist NUMERIC(5, 2) NOT NULL,
    hips NUMERIC(5, 2), 
    shoulder NUMERIC(5, 2) NOT NULL,
    arm_hole NUMERIC(5, 2) NOT NULL,
    sleeve_length NUMERIC(5, 2) NOT NULL,
    sleeve_circumference NUMERIC(5, 2) NOT NULL,
    blouse_length NUMERIC(5, 2) NOT NULL,
    front_neck_depth NUMERIC(5, 2),
    back_neck_depth NUMERIC(5, 2),
    
    notes TEXT,
    is_verified BOOLEAN DEFAULT FALSE, -- User confirmed accuracy
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fabrics Table (Merchant Inventory)
CREATE TABLE fabrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES users(id), -- The vendor supplying this fabric
    name VARCHAR(100) NOT NULL,
    description TEXT,
    material_type VARCHAR(50), -- Silk, Cotton, Velvet, etc.
    image_url VARCHAR(500),
    price_per_meter NUMERIC(10, 2) NOT NULL,
    stock_quantity NUMERIC(10, 2) DEFAULT 0, -- In meters
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Base Designs / Templates (Created by Designers)
CREATE TABLE base_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    designer_id UUID REFERENCES users(id), -- The creator of this design
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- 'Bridal', 'Workwear', 'Party'
    image_url VARCHAR(500),
    base_price NUMERIC(10, 2) NOT NULL,
    complexity_level VARCHAR(20) DEFAULT 'medium', -- 'simple', 'medium', 'complex'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Design Options (For customization dropdowns)
CREATE TABLE design_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    option_type VARCHAR(50) NOT NULL, -- 'Front Neck', 'Back Neck', 'Sleeve', 'Add-on'
    name VARCHAR(100) NOT NULL,
    image_url VARCHAR(500),
    price_modifier NUMERIC(10, 2) DEFAULT 0.00,
    is_available BOOLEAN DEFAULT TRUE
);

-- Orders Table (The Core Object)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Customer
    tailor_id UUID REFERENCES users(id), -- Assigned Tailor
    
    status VARCHAR(50) DEFAULT 'draft' 
        CHECK (status IN (
            'draft', 'locked', 'placed', 'accepted', 
            'in_production', 'quality_check', 'shipped', 
            'delivered', 'alteration_requested', 'closed', 'cancelled'
        )),
        
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    shipping_address TEXT,
    
    -- Dates
    deadline_date DATE,
    delivery_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
-- Links an order to specific customized items + snapshots measurements
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    base_design_id UUID REFERENCES base_designs(id),
    fabric_id UUID REFERENCES fabrics(id), -- Optional if customer provides fabric
    
    -- Snapshot of measurements at time of order (JSONB to preserve history)
    measurement_snapshot JSONB NOT NULL,
    
    -- Customization details stored as JSONB
    -- { "front_neck": "Sweetheart", "addons": ["Tassels", "Piping"], "instructions": "..." }
    customization_details JSONB DEFAULT '{}',
    
    -- References
    reference_image_url VARCHAR(500),
    customer_fabric_image_url VARCHAR(500),
    
    quantity INTEGER DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL
);

-- Quality Checks (Tailor -> Admin Validation)
CREATE TABLE quality_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    tailor_id UUID REFERENCES users(id),
    
    measurements_verified BOOLEAN DEFAULT FALSE,
    finishing_verified BOOLEAN DEFAULT FALSE,
    addons_verified BOOLEAN DEFAULT FALSE,
    comments TEXT,
    
    admin_approver_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50), 
    payment_status VARCHAR(50) DEFAULT 'pending',
    transaction_reference VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Alterations Table
CREATE TABLE alterations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    user_request_description TEXT NOT NULL,
    tailor_notes TEXT,
    status VARCHAR(50) DEFAULT 'requested',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

