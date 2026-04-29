CREATE TABLE IF NOT EXISTS apply_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id),
  deleted_at TIMESTAMP,
  deleted_by UUID REFERENCES users(id)
);