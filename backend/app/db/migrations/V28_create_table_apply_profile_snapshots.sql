CREATE TABLE IF NOT EXISTS apply_profile_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  apply_id UUID NOT NULL REFERENCES applies(id) ON DELETE CASCADE,

  full_name VARCHAR(255),
  email VARCHAR(255),
  birth_place VARCHAR(255),
  birth_date VARCHAR(255),
  gender VARCHAR(20),
  phone_code VARCHAR(10),
  phone VARCHAR(20),
  address VARCHAR(255),
  kelurahan VARCHAR(255),
  kecamatan VARCHAR(255),
  city VARCHAR(255),
  province VARCHAR(255),
  postal_code VARCHAR(10),
  linkedin_url VARCHAR(255),
  cv_url VARCHAR(255),
  cv_file_name VARCHAR(255),

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id),
  deleted_at TIMESTAMP,
  deleted_by UUID REFERENCES users(id)
);