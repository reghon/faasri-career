export const userQueries = {
  findUserByEmail: `
    SELECT u.*, r.name as role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.email = $1
    LIMIT 1
  `,

  findUserById: `
    SELECT u.id, u.email, u."isActive", u."createdAt", u."updatedAt", r.name as role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = $1
    LIMIT 1
  `,

  createUser: `
    INSERT INTO users (id, email, password, "isActive", "createdAt", "updatedAt", role_id)
    VALUES (gen_random_uuid(), $1, $2, true, NOW(), NOW(), $3)
    RETURNING id, email, "isActive", "createdAt", role_id
  `,

  findRoleByName: `
    SELECT id FROM roles WHERE name = $1 LIMIT 1
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
