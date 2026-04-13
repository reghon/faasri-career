CREATE TABLE IF NOT EXISTS apply_status_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  apply_id UUID NOT NULL REFERENCES applies(id) ON DELETE CASCADE,
  from_status_id UUID REFERENCES apply_statuses(id) ON DELETE RESTRICT,
  to_status_id UUID NOT NULL REFERENCES apply_statuses(id) ON DELETE RESTRICT,

  notes TEXT,
  changed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  changed_by UUID REFERENCES users(id),

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id),
  deleted_at TIMESTAMP,
  deleted_by UUID REFERENCES users(id)
);