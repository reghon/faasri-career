CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  issuer VARCHAR(255),
  "issuedDay" VARCHAR(10),
  "issuedMonth" VARCHAR(10),
  "issuedYear" VARCHAR(10),
  "expiredDay" VARCHAR(10),
  "expiredMonth" VARCHAR(10),
  "expiredYear" VARCHAR(10),
  "updatedBy" VARCHAR(255),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  applicant_profile_id UUID REFERENCES applicant_profiles(id) ON DELETE CASCADE
);