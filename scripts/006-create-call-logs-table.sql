-- Create call_logs table to store Vapi call data from webhooks
CREATE TABLE IF NOT EXISTS call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vapi_call_id VARCHAR(255) UNIQUE,
  customer_phone VARCHAR(50),
  duration_seconds INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'unknown',
  ended_reason VARCHAR(255),
  summary TEXT,
  recording_url TEXT,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_call_logs_started_at ON call_logs(started_at);
CREATE INDEX IF NOT EXISTS idx_call_logs_customer_phone ON call_logs(customer_phone);
CREATE INDEX IF NOT EXISTS idx_call_logs_status ON call_logs(status);
