CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  call_id TEXT,
  customer_name TEXT,
  phone_number TEXT,
  service_type TEXT,
  appointment_date TEXT,
  appointment_time TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(phone_number);
