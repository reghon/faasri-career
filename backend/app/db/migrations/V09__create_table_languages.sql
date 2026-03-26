CREATE TABLE IF NOT EXISTS languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language VARCHAR(255),
  proficiency VARCHAR(255),
  "updatedBy" VARCHAR(255),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  applicant_profile_id UUID REFERENCES applicant_profiles(id) ON DELETE CASCADE
);