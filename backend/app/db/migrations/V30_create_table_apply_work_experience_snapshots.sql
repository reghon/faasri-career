CREATE TABLE IF NOT EXISTS apply_work_experience_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  apply_id UUID NOT NULL REFERENCES applies(id) ON DELETE CASCADE,

  company VARCHAR(255),
  industry VARCHAR(255),
  position VARCHAR(255),
  employment_type VARCHAR(255),
  job_level VARCHAR(255),
  team_size VARCHAR(50),
  start_day VARCHAR(10),
  start_month VARCHAR(10),
  start_year VARCHAR(10),
  end_day VARCHAR(10),
  end_month VARCHAR(10),
  end_year VARCHAR(10),
  is_current_job BOOLEAN DEFAULT false,
  responsibilities TEXT,
  leave_reason VARCHAR(255),
  reference_name VARCHAR(255),
  reference_position VARCHAR(255),
  reference_phone_code VARCHAR(10),
  reference_phone VARCHAR(50),
  reference_email VARCHAR(255),

  sort_order INT NOT NULL DEFAULT 0,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by VARCHAR(100),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by VARCHAR (100),
  deleted_at TIMESTAMP,
  deleted_by VARCHAR(100) 
);