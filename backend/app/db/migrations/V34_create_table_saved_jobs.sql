CREATE TABLE saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  job_id UUID REFERENCES jobs(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by VARCHAR(100),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by VARCHAR (100),
  deleted_at TIMESTAMP,
  deleted_by VARCHAR(100),
  CONSTRAINT uq_saved_jobs_user_job
    UNIQUE (user_id, job_id)
);