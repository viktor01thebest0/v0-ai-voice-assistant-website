-- Create appointments table for storing bookings
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  service VARCHAR(255) NOT NULL,
  stylist VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed',
  -- Removed google_calendar_event_id field since we're not using Google Calendar
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_appointments_date_time ON appointments(appointment_date, appointment_time, stylist);
CREATE INDEX idx_appointments_phone ON appointments(customer_phone);
