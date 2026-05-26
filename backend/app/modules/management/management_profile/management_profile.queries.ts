const SELECT_FIELDS = `
  id, user_id, role_id, full_name, is_active
`;

const DETAIL_FIELDS = `
  id, user_id, role_id, full_name, is_active,
  created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
`;

const INSERT_FIELDS = `
  user_id, role_id, full_name, is_active, created_at, created_by, updated_at, updated_by
`;

export const managementProfileQueries = {
  getAll: `
    SELECT ${SELECT_FIELDS}
    FROM management_profiles
    WHERE deleted_at IS NULL
    ORDER BY full_name ASC
  `,

  getById: `
    SELECT ${SELECT_FIELDS}
    FROM management_profiles
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  updateMe: `
    UPDATE management_profiles
    SET
      full_name = $1,
      updated_at = NOW(),
      updated_by = $2
    WHERE user_id = $2
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,

  getDetailById: `
    SELECT ${DETAIL_FIELDS}
    FROM management_profiles
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByUserId: `
    SELECT ${SELECT_FIELDS}
    FROM management_profiles
    WHERE user_id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO management_profiles (${INSERT_FIELDS})
    VALUES ($1, $2, $3, $4, NOW(), $5, NOW(), $5)
    RETURNING ${SELECT_FIELDS}
  `,

  update: `
    UPDATE management_profiles
    SET
      user_id = $1,
      role_id = $2,
      full_name = $3,
      is_active = $4,
      updated_at = NOW(),
      updated_by = $5
    WHERE id = $6
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,

  softDelete: `
    UPDATE management_profiles
    SET
      deleted_at = NOW(),
      deleted_by = $2,
      updated_at = NOW(),
      updated_by = $2
    WHERE id = $1
      AND deleted_at IS NULL
    RETURNING ${DETAIL_FIELDS}
  `,
};
