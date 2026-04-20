export const userQueries = {
  findAll: `
    SELECT
      u.id,
      u.role_id,
      u.email,
      u.is_active,
      u.created_at,
      u.created_by,
      u.updated_at,
      u.updated_by,
      r.name AS role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.deleted_at IS NULL
    ORDER BY u.created_at DESC
  `,

  findDetailById: `
    SELECT
      u.id,
      u.role_id,
      u.email,
      u.is_active,
      u.created_at,
      u.created_by,
      u.updated_at,
      u.updated_by,
      u.deleted_at,
      u.deleted_by,
      r.name AS role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = $1
      AND u.deleted_at IS NULL
    LIMIT 1
  `,

  findByEmail: `
    SELECT
      u.id,
      u.email
    FROM users u
    WHERE u.email = $1
      AND u.deleted_at IS NULL
    LIMIT 1
  `,

  findRoleByName: `
    SELECT
      id,
      name
    FROM roles
    WHERE LOWER(name) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO users (
      role_id,
      email,
      password,
      is_active,
      otp,
      otp_expired_at,
      created_at,
      created_by,
      updated_at,
      updated_by
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      NULL,
      NULL,
      NOW(),
      $5,
      NOW(),
      $5
    )
    RETURNING
      id,
      role_id,
      email,
      is_active,
      created_at,
      created_by,
      updated_at,
      updated_by,
      deleted_at,
      deleted_by
  `,

  update: `
    UPDATE users
    SET
      role_id = $1,
      email = $2,
      password = COALESCE($3, password),
      is_active = $4,
      updated_at = NOW(),
      updated_by = $5
    WHERE id = $6
      AND deleted_at IS NULL
    RETURNING
      id,
      role_id,
      email,
      is_active,
      created_at,
      created_by,
      updated_at,
      updated_by,
      deleted_at,
      deleted_by
  `,

  softDelete: `
    UPDATE users
    SET
      deleted_at = NOW(),
      deleted_by = $2,
      updated_at = NOW(),
      updated_by = $2
    WHERE id = $1
      AND deleted_at IS NULL
    RETURNING
      id,
      role_id,
      email,
      is_active,
      created_at,
      created_by,
      updated_at,
      updated_by,
      deleted_at,
      deleted_by
  `,
};
