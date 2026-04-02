export const userQueries = {
  findUserByEmail: `
    SELECT u.*, r.name AS role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.email = $1
      AND u.deleted_at IS NULL
    LIMIT 1
  `,

  findUserById: `
    SELECT u.id, u.email, u.is_active, r.name AS role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = $1
      AND u.deleted_at IS NULL
    LIMIT 1
  `,

  createUser: `
    INSERT INTO users (
      id, role_id, email, password, is_active, otp, otp_expired_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), $1, $2, $3, FALSE, $4, $5, NOW(), NOW()
    )
    RETURNING id, email, is_active, created_at, role_id
  `,

  activateUser: `
    UPDATE users
    SET is_active = true, otp = NULL, otp_expired_at = NULL, updated_at = NOW()
    WHERE id = $1
  `,

  findRoleByName: `
    SELECT id
    FROM roles
    WHERE name = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  storeRefreshToken: `
    INSERT INTO refresh_tokens (id, user_id, token, expires_at)
    VALUES (gen_random_uuid(), $1, $2, $3)
    ON CONFLICT (user_id) DO UPDATE SET token = $2, expires_at = $3
  `,

  findRefreshToken: `
    SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW() LIMIT 1
  `,

  deleteRefreshToken: `
    DELETE FROM refresh_tokens WHERE token = $1
  `,
};
