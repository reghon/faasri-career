ALTER TABLE users
ADD COLUMN IF NOT EXISTS session_version INTEGER NOT NULL DEFAULT 0;

ALTER TABLE refresh_tokens
DROP CONSTRAINT IF EXISTS refresh_tokens_user_id_key;

ALTER TABLE refresh_tokens
ADD CONSTRAINT refresh_tokens_token_key UNIQUE (token);
