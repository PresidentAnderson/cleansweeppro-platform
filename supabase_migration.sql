-- CleanSweepPro Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  position TEXT NOT NULL,
  hourly_rate DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  hire_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointment status enum
CREATE TYPE appointment_status AS ENUM (
  'scheduled',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  status appointment_status DEFAULT 'scheduled' NOT NULL,
  notes TEXT,
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_user_id ON staff(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_is_active ON staff(is_active);
CREATE INDEX IF NOT EXISTS idx_services_name ON services(name);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_staff_id ON appointments(staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service_id ON appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_date ON appointments(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers
CREATE POLICY "Users can view all customers" ON customers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert customers" ON customers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update customers" ON customers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete customers" ON customers
  FOR DELETE USING (auth.role() = 'authenticated');

-- RLS Policies for staff
CREATE POLICY "Users can view all staff" ON staff
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert staff" ON staff
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update staff" ON staff
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete staff" ON staff
  FOR DELETE USING (auth.role() = 'authenticated');

-- RLS Policies for services
CREATE POLICY "Users can view all services" ON services
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert services" ON services
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update services" ON services
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete services" ON services
  FOR DELETE USING (auth.role() = 'authenticated');

-- RLS Policies for appointments
CREATE POLICY "Users can view all appointments" ON appointments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert appointments" ON appointments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update appointments" ON appointments
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete appointments" ON appointments
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data (optional)
INSERT INTO services (name, description, price, duration_minutes) VALUES
  ('Basic Cleaning', 'Standard house cleaning service', 89.99, 120),
  ('Deep Cleaning', 'Comprehensive deep cleaning service', 149.99, 180),
  ('Move-In/Out Cleaning', 'Thorough cleaning for moving', 199.99, 240),
  ('Office Cleaning', 'Commercial office space cleaning', 129.99, 150),
  ('Window Cleaning', 'Interior and exterior window cleaning', 79.99, 90)
ON CONFLICT (name) DO NOTHING;
