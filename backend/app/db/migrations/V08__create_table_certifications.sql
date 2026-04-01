CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_profile_id UUID REFERENCES applicant_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255),
  issuer VARCHAR(255),
  issued_day VARCHAR(10),
  issued_month VARCHAR(10),
  issued_year VARCHAR(10),
  expired_day VARCHAR(10),
  expired_month VARCHAR(10),
  expired_year VARCHAR(10),
  updated_by VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
 );