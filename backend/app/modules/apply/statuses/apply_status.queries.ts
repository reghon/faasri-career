const SELECT_FIELDS = `
  id, code, name, description, sort_order,
  is_default, is_final, is_active
`;

export const applyStatusQueries = {
  getDefault: `
    SELECT ${SELECT_FIELDS}
    FROM apply_statuses
    WHERE is_default = TRUE
      AND is_active = TRUE
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getById: `
    SELECT ${SELECT_FIELDS}
    FROM apply_statuses
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getAllActive: `
    SELECT ${SELECT_FIELDS}
    FROM apply_statuses
    WHERE is_active = TRUE
      AND deleted_at IS NULL
    ORDER BY sort_order ASC, name ASC
  `,
};
