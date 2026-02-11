-- Add unique constraint to vapi_call_id for upsert support
ALTER TABLE call_logs ADD CONSTRAINT call_logs_vapi_call_id_unique UNIQUE (vapi_call_id);
