export const authQueries = {
  findByEmail: `
    SELECT
      u.id, u.role_id, u.email, u.password, u.is_active, u.otp,
      u.session_version,
      u.otp_expired_at, u.created_at, u.created_by, u.updated_at,
      u.updated_by, u.deleted_at, u.deleted_by, r.name AS role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.email = $1
      AND u.deleted_at IS NULL
    LIMIT 1
  `,

  findById: `
    SELECT
      u.id, u.role_id, u.email, u.is_active, u.session_version, r.name AS role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = $1
      AND u.deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO users (
      role_id, email, password, is_active,
      otp, otp_expired_at, created_at, updated_at
    )
    VALUES (
      $1, $2, $3, FALSE,
      $4, $5, NOW(), NOW()
    )
    RETURNING
      id, email, is_active, created_at, role_id
  `,

  updateUnverifiedRegistration: `
    UPDATE users
    SET
      password = $1,
      otp = $2,
      otp_expired_at = $3,
      updated_at = NOW()
    WHERE id = $4
      AND is_active = FALSE
      AND deleted_at IS NULL
    RETURNING
      id, email, is_active, created_at, role_id
  `,

  activateUser: `
    UPDATE users
    SET
      is_active = TRUE,
      otp = NULL,
      otp_expired_at = NULL,
      updated_at = NOW()
    WHERE id = $1
  `,

  findRoleByName: `
    SELECT
      id, name
    FROM roles
    WHERE name = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  storeRefreshToken: `
    INSERT INTO refresh_tokens (
      id, user_id, token, expires_at
    )
    VALUES (
      gen_random_uuid(), $1, $2, $3
    )
    ON CONFLICT (token)
    DO UPDATE SET expires_at = $3
  `,

  findRefreshToken: `
    SELECT
      id, user_id, token, expires_at
    FROM refresh_tokens
    WHERE token = $1
      AND expires_at > NOW()
    LIMIT 1
  `,

  deleteRefreshToken: `
    DELETE FROM refresh_tokens
    WHERE token = $1
  `,

  updateEmail: `
  UPDATE users
  SET email = $1, session_version = session_version + 1, updated_at = NOW()
  WHERE id = $2
  RETURNING session_version
`,

  updateOtp: `
  UPDATE users
  SET otp = $1, otp_expired_at = $2, updated_at = NOW()
  WHERE id = $3
`,

  updatePassword: `
  UPDATE users
  SET password = $1, session_version = session_version + 1, updated_at = NOW()
  WHERE id = $2
  RETURNING session_version
`,

  findByEmailExcludeId: `
  SELECT id FROM users
  WHERE email = $1
    AND id != $2
    AND deleted_at IS NULL
  LIMIT 1
`,

  findByIdFull: `
  SELECT
    u.id, u.role_id, u.email, u.password, u.is_active,
    u.session_version,
    u.otp, u.otp_expired_at, r.name AS role_name
  FROM users u
  LEFT JOIN roles r ON u.role_id = r.id
  WHERE u.id = $1
    AND u.deleted_at IS NULL
  LIMIT 1
`,

  deleteRefreshTokenByUserId: `
  DELETE FROM refresh_tokens WHERE user_id = $1
`,

  deleteOtherRefreshTokensByUserId: `
  DELETE FROM refresh_tokens
  WHERE user_id = $1
    AND token <> $2
`,

  verifyForgotPasswordOtp: `
  SELECT id, otp, otp_expired_at
  FROM users
  WHERE email = $1
    AND deleted_at IS NULL
  LIMIT 1
`,
};
