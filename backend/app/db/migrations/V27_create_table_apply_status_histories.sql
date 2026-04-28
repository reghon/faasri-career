CREATE TABLE IF NOT EXISTS apply_status_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  apply_id UUID NOT NULL REFERENCES applies(id) ON DELETE CASCADE,
  apply_status_id UUID REFERENCES apply_statuses(id),
  apply_status_name VARCHAR(244) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id),
  deleted_at TIMESTAMP,
  deleted_by UUID REFERENCES users(id)
);