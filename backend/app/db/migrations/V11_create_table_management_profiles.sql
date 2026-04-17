CREATE TABLE IF NOT EXISTS management_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  role_id UUID REFERENCES roles(id),
  full_name VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id),
  deleted_at TIMESTAMP,
  deleted_by UUID REFERENCES users(id)
);