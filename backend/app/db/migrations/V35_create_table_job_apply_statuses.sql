CREATE TABLE job_apply_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id),
  apply_status_id UUID NOT NULL REFERENCES apply_statuses(id),
  sort_order INT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_final BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id),
  deleted_at TIMESTAMP,
  deleted_by UUID REFERENCES users(id)
);

  CREATE UNIQUE INDEX IF NOT EXISTS uq_job_apply_status_active
ON job_apply_statuses (job_id, apply_status_id)
WHERE deleted_at IS NULL;