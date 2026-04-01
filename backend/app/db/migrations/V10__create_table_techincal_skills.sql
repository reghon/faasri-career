CREATE TABLE IF NOT EXISTS technical_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   applicant_profile_id UUID REFERENCES applicant_profiles(id) ON DELETE CASCADE,
   skill_name VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id),
  deleted_at TIMESTAMP,
  deleted_by UUID REFERENCES users(id)
 );