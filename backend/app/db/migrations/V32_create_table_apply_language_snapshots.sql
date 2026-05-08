CREATE TABLE IF NOT EXISTS apply_language_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  apply_id UUID NOT NULL REFERENCES applies(id) ON DELETE CASCADE,

  language VARCHAR(255),
  proficiency VARCHAR(255),

  sort_order INT NOT NULL DEFAULT 0,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by VARCHAR(100),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by VARCHAR (100),
  deleted_at TIMESTAMP,
  deleted_by VARCHAR(100) 
);