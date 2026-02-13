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

CREATE INDEX IF NOT EXISTS idx_bookings_call_id ON bookings(call_id);
CREATE INDEX IF NOT EXISTS idx_bookings_appointment_date ON bookings(appointment_date);
