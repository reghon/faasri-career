CREATE TABLE IF NOT EXISTS applies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  applicant_profile_id UUID REFERENCES applicant_profiles(id) ON DELETE RESTRICT,
  job_id UUID REFERENCES jobs(id) ON DELETE RESTRICT,
  status_id UUID REFERENCES apply_statuses(id),
  application_code VARCHAR(100),
  notes TEXT,

  applied_at TIMESTAMP NOT NULL DEFAULT NOW(),

  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id),
  deleted_at TIMESTAMP,
  deleted_by UUID REFERENCES users(id)
);