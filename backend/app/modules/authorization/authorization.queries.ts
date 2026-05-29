export const authorizationQueries = {
  hasPermission: `
    SELECT EXISTS (
      SELECT 1
      FROM roles r
      WHERE r.id = $1
        AND r.deleted_at IS NULL
        AND r.is_active = TRUE
        AND (
          r.is_superadmin = TRUE
          OR EXISTS (
            SELECT 1
            FROM role_permissions rp
            JOIN permissions p
              ON p.id = rp.permission_id
            WHERE rp.role_id = r.id
              AND rp.is_active = TRUE
              AND rp.deleted_at IS NULL
              AND p.is_active = TRUE
              AND p.deleted_at IS NULL
              AND p.code = $2
          )
        )
    ) AS has_permission
  `,

  getRolePermissions: `
    SELECT
      p.id AS permission_id,
      p.code AS permission_code,
      p.name AS permission_name
    FROM role_permissions rp
    JOIN permissions p
      ON p.id = rp.permission_id
    JOIN roles r
      ON r.id = rp.role_id
    WHERE rp.role_id = $1
      AND r.deleted_at IS NULL
      AND r.is_active = TRUE
      AND rp.deleted_at IS NULL
      AND rp.is_active = TRUE
      AND p.deleted_at IS NULL
      AND p.is_active = TRUE
    ORDER BY p.code ASC
  `,
};
