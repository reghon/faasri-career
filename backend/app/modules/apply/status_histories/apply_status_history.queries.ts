const SELECT_FIELDS = `
  id, apply_id, apply_status_id, apply_status_name, notes
`;

const DETAIL_FIELDS = `
  id, apply_id, apply_status_id, apply_status_name, notes,
  created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
`;

export const applyStatusHistoryQueries = {
  getAll: `
    SELECT ${SELECT_FIELDS}
    FROM apply_status_histories
    WHERE deleted_at IS NULL
    ORDER BY created_at DESC
  `,

  getById: `
    SELECT ${SELECT_FIELDS}
    FROM apply_status_histories
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getDetailById: `
    SELECT ${DETAIL_FIELDS}
    FROM apply_status_histories
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByApplyId: `
    SELECT ${DETAIL_FIELDS}
    FROM apply_status_histories
    WHERE apply_id = $1
      AND deleted_at IS NULL
    ORDER BY created_at ASC
  `,

  getLatestByApplyId: `
    SELECT
      ash.id,
      ash.apply_id,
      ash.apply_status_id,
      ash.apply_status_name,
      ash.notes,
      aps.sort_order
    FROM apply_status_histories ash
    LEFT JOIN apply_statuses aps
      ON aps.id = ash.apply_status_id
    WHERE ash.apply_id = $1
      AND ash.deleted_at IS NULL
    ORDER BY ash.created_at DESC
    LIMIT 1
  `,

  getApplyById: `
  SELECT
    a.id,
    a.job_id,
    a.status_id,
    jas.sort_order AS status_sort_order,
    jas.is_final AS status_is_final
  FROM applies a
  JOIN job_apply_statuses jas
    ON jas.job_id = a.job_id
   AND jas.apply_status_id = a.status_id
   AND jas.deleted_at IS NULL
  WHERE a.id = $1
    AND a.deleted_at IS NULL
  LIMIT 1
`,

  getApplyStatusById: `
  SELECT
    aps.id,
    aps.code,
    aps.name,
    jas.sort_order,
    jas.is_final
  FROM job_apply_statuses jas
  JOIN apply_statuses aps
    ON aps.id = jas.apply_status_id
   AND aps.deleted_at IS NULL
  WHERE jas.job_id = $1
    AND jas.apply_status_id = $2
    AND jas.is_active = true
    AND jas.deleted_at IS NULL
  LIMIT 1
`,
  getStatusesBySortOrderRange: `
  SELECT
    aps.id,
    aps.code,
    aps.name,
    jas.sort_order,
    jas.is_final
  FROM job_apply_statuses jas
  JOIN apply_statuses aps
    ON aps.id = jas.apply_status_id
   AND aps.deleted_at IS NULL
  WHERE jas.job_id = $1
    AND jas.sort_order BETWEEN $2 AND $3
    AND jas.is_active = true
    AND jas.deleted_at IS NULL
  ORDER BY jas.sort_order ASC
`,

  create: `
    INSERT INTO apply_status_histories (
      apply_id,
      apply_status_id,
      apply_status_name,
      notes,
      created_at,
      created_by,
      updated_at,
      updated_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $5, $6)
    RETURNING ${SELECT_FIELDS}
  `,

  update: `
    UPDATE apply_status_histories
    SET
      notes = $1,
      updated_at = NOW(),
      updated_by = $2
    WHERE id = $3
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,

  softDelete: `
    UPDATE apply_status_histories
    SET
      deleted_at = NOW(),
      deleted_by = $2,
      updated_at = NOW(),
      updated_by = $2
    WHERE id = $1
      AND deleted_at IS NULL
    RETURNING ${DETAIL_FIELDS}
  `,
  updateApplyStatus: `
  UPDATE applies
  SET
    status_id = $1,
    updated_at = NOW(),
    updated_by = $2
  WHERE id = $3
    AND deleted_at IS NULL
  RETURNING id
`,
};
