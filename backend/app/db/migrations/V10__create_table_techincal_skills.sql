CREATE TABLE IF NOT EXISTS technical_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   applicant_profile_id UUID REFERENCES applicant_profiles(id) ON DELETE CASCADE,
   skill_name VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by VARCHAR(100),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by VARCHAR (100),
  deleted_at TIMESTAMP,
  deleted_by VARCHAR(100) 
 );