const SELECT_FIELDS = `
  p.id,
  p.module_id,
  p.permission_action_id,
  p.code,
  p.name,
  p.description,
  p.is_active,
  p.created_at,
  p.created_by,
  p.updated_at,
  p.updated_by,
  p.deleted_at,
  p.deleted_by,
  m.code AS module_code,
  m.name AS module_name,
  pa.code AS permission_action_code,
  pa.name AS permission_action_name
`;

const INSERT_FIELDS = `
  module_id,
  permission_action_id,
  code,
  name,
  description,
  is_active,
  created_at,
  created_by,
  updated_at,
  updated_by
`;

export const permissionQueries = {
  getAll: `
    SELECT ${SELECT_FIELDS}
    FROM permissions p
    JOIN modules m ON m.id = p.module_id
    JOIN permission_actions pa ON pa.id = p.permission_action_id
    WHERE p.deleted_at IS NULL
      AND m.deleted_at IS NULL
      AND pa.deleted_at IS NULL
    ORDER BY p.updated_at DESC, p.name ASC
  `,

  getById: `
    SELECT ${SELECT_FIELDS}
    FROM permissions p
    JOIN modules m ON m.id = p.module_id
    JOIN permission_actions pa ON pa.id = p.permission_action_id
    WHERE p.id = $1
      AND p.deleted_at IS NULL
      AND m.deleted_at IS NULL
      AND pa.deleted_at IS NULL
    LIMIT 1
  `,

  getByCode: `
    SELECT ${SELECT_FIELDS}
    FROM permissions p
    JOIN modules m ON m.id = p.module_id
    JOIN permission_actions pa ON pa.id = p.permission_action_id
    WHERE LOWER(p.code) = LOWER($1)
      AND p.deleted_at IS NULL
      AND m.deleted_at IS NULL
      AND pa.deleted_at IS NULL
    LIMIT 1
  `,

  getByModuleAndAction: `
    SELECT ${SELECT_FIELDS}
    FROM permissions p
    JOIN modules m ON m.id = p.module_id
    JOIN permission_actions pa ON pa.id = p.permission_action_id
    WHERE p.module_id = $1
      AND p.permission_action_id = $2
      AND p.deleted_at IS NULL
      AND m.deleted_at IS NULL
      AND pa.deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO permissions (${INSERT_FIELDS})
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, NOW(), $7)
    RETURNING
      id,
      module_id,
      permission_action_id,
      code,
      name,
      description,
      is_active,
      created_at,
      created_by,
      updated_at,
      updated_by,
      deleted_at,
      deleted_by
  `,

  update: `
    UPDATE permissions
    SET
      module_id = $1,
      permission_action_id = $2,
      code = $3,
      name = $4,
      description = $5,
      is_active = $6,
      updated_at = NOW(),
      updated_by = $7
    WHERE id = $8
      AND deleted_at IS NULL
    RETURNING
      id,
      module_id,
      permission_action_id,
      code,
      name,
      description,
      is_active,
      created_at,
      created_by,
      updated_at,
      updated_by,
      deleted_at,
      deleted_by
  `,

  softDelete: `
    UPDATE permissions
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
