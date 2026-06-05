const SELECT_FIELDS = `
  rp.id,
  rp.role_id,
  rp.permission_id,
  rp.is_active,
  rp.created_at,
  rp.created_by,
  rp.updated_at,
  rp.updated_by,
  rp.deleted_at,
  rp.deleted_by,
  r.code AS role_code,
  r.name AS role_name,
  p.code AS permission_code,
  p.name AS permission_name,
  m.code AS module_code,
  m.name AS module_name,
  pa.code AS permission_action_code,
  pa.name AS permission_action_name
`;

const INSERT_FIELDS = `
  role_id,
  permission_id,
  is_active,
  created_at,
  created_by,
  updated_at,
  updated_by
`;

export const rolePermissionQueries = {
  getAll: `
    SELECT ${SELECT_FIELDS}
    FROM role_permissions rp
    JOIN roles r ON r.id = rp.role_id
    JOIN permissions p ON p.id = rp.permission_id
    JOIN modules m ON m.id = p.module_id
    JOIN permission_actions pa ON pa.id = p.permission_action_id
    WHERE rp.deleted_at IS NULL
      AND r.deleted_at IS NULL
      AND p.deleted_at IS NULL
      AND m.deleted_at IS NULL
      AND pa.deleted_at IS NULL
      AND r.code != 'APPLICANT'
    ORDER BY rp.updated_at DESC, r.name ASC, p.name ASC
  `,

  getById: `
    SELECT ${SELECT_FIELDS}
    FROM role_permissions rp
    JOIN roles r ON r.id = rp.role_id
    JOIN permissions p ON p.id = rp.permission_id
    JOIN modules m ON m.id = p.module_id
    JOIN permission_actions pa ON pa.id = p.permission_action_id
    WHERE rp.id = $1
      AND rp.deleted_at IS NULL
      AND r.deleted_at IS NULL
      AND p.deleted_at IS NULL
      AND m.deleted_at IS NULL
      AND pa.deleted_at IS NULL
    LIMIT 1
  `,

  getByRoleAndPermission: `
    SELECT ${SELECT_FIELDS}
    FROM role_permissions rp
    JOIN roles r ON r.id = rp.role_id
    JOIN permissions p ON p.id = rp.permission_id
    JOIN modules m ON m.id = p.module_id
    JOIN permission_actions pa ON pa.id = p.permission_action_id
    WHERE rp.role_id = $1
      AND rp.permission_id = $2
      AND rp.deleted_at IS NULL
      AND r.deleted_at IS NULL
      AND p.deleted_at IS NULL
      AND m.deleted_at IS NULL
      AND pa.deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO role_permissions (${INSERT_FIELDS})
    VALUES ($1, $2, $3, NOW(), $4, NOW(), $4)
    RETURNING
      id,
      role_id,
      permission_id,
      is_active,
      created_at,
      created_by,
      updated_at,
      updated_by,
      deleted_at,
      deleted_by
  `,

  update: `
    UPDATE role_permissions
    SET
      role_id = $1,
      permission_id = $2,
      is_active = $3,
      updated_at = NOW(),
      updated_by = $4
    WHERE id = $5
      AND deleted_at IS NULL
    RETURNING
      id,
      role_id,
      permission_id,
      is_active,
      created_at,
      created_by,
      updated_at,
      updated_by,
      deleted_at,
      deleted_by
  `,

  softDelete: `
    UPDATE role_permissions
    SET
      deleted_at = NOW(),
      deleted_by = $2,
      updated_at = NOW(),
      updated_by = $2
    WHERE id = $1
      AND deleted_at IS NULL
    RETURNING id
  `,
};
