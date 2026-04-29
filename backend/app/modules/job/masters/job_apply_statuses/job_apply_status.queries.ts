const SELECT_FIELDS = `
  jas.id,
  jas.job_id,
  jas.apply_status_id,
  jas.sort_order,
  jas.is_default,
  jas.is_final,
  jas.is_active,
  aps.code AS apply_status_code,
  aps.name AS apply_status_name,
  aps.description AS apply_status_description
`;

const DETAIL_FIELDS = `
  ${SELECT_FIELDS},
  jas.created_at,
  jas.created_by,
  jas.updated_at,
  jas.updated_by,
  jas.deleted_at,
  jas.deleted_by
`;

const BASE_FROM = `
  FROM job_apply_statuses jas
  JOIN apply_statuses aps ON aps.id = jas.apply_status_id
`;

export const jobApplyStatusQueries = {
  getAll: `
    SELECT ${SELECT_FIELDS}
    ${BASE_FROM}
    WHERE jas.deleted_at IS NULL
      AND aps.deleted_at IS NULL
    ORDER BY jas.job_id ASC, jas.sort_order ASC
  `,

  getByJobId: `
    SELECT ${SELECT_FIELDS}
    ${BASE_FROM}
    WHERE jas.job_id = $1
      AND jas.deleted_at IS NULL
      AND aps.deleted_at IS NULL
    ORDER BY jas.sort_order ASC
  `,

  getById: `
    SELECT ${SELECT_FIELDS}
    ${BASE_FROM}
    WHERE jas.id = $1
      AND jas.deleted_at IS NULL
      AND aps.deleted_at IS NULL
    LIMIT 1
  `,

  getDetailById: `
    SELECT ${DETAIL_FIELDS}
    ${BASE_FROM}
    WHERE jas.id = $1
      AND jas.deleted_at IS NULL
      AND aps.deleted_at IS NULL
    LIMIT 1
  `,

  getJobById: `
    SELECT id
    FROM jobs
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getApplyStatusById: `
    SELECT id
    FROM apply_statuses
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByJobAndApplyStatus: `
    SELECT id
    FROM job_apply_statuses
    WHERE job_id = $1
      AND apply_status_id = $2
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByJobAndApplyStatusExceptId: `
    SELECT id
    FROM job_apply_statuses
    WHERE job_id = $1
      AND apply_status_id = $2
      AND id <> $3
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByJobAndSortOrder: `
    SELECT id
    FROM job_apply_statuses
    WHERE job_id = $1
      AND sort_order = $2
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByJobAndSortOrderExceptId: `
    SELECT id
    FROM job_apply_statuses
    WHERE job_id = $1
      AND sort_order = $2
      AND id <> $3
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getDefaultByJobId: `
    SELECT id
    FROM job_apply_statuses
    WHERE job_id = $1
      AND is_default = true
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getDefaultByJobIdExceptId: `
    SELECT id
    FROM job_apply_statuses
    WHERE job_id = $1
      AND is_default = true
      AND id <> $2
      AND deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO job_apply_statuses (
      job_id,
      apply_status_id,
      sort_order,
      is_default,
      is_final,
      is_active,
      created_at,
      created_by,
      updated_at,
      updated_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, NOW(), $7)
    RETURNING id
  `,

  update: `
    UPDATE job_apply_statuses
    SET
      apply_status_id = $1,
      sort_order = $2,
      is_default = $3,
      is_final = $4,
      is_active = $5,
      updated_at = NOW(),
      updated_by = $6
    WHERE id = $7
      AND deleted_at IS NULL
    RETURNING id
  `,

  softDelete: `
    UPDATE job_apply_statuses
    SET
      deleted_at = NOW(),
      deleted_by = $2,
      updated_at = NOW(),
      updated_by = $2
    WHERE id = $1
      AND deleted_at IS NULL
    RETURNING ${DETAIL_FIELDS}
  `,

  getEditGuardByJobId: `
  SELECT
    COUNT(a.id)::int AS total_applies,
    COUNT(a.id) FILTER (
      WHERE COALESCE(jas.sort_order, 999) > 1
    )::int AS locked_applies
  FROM applies a
  LEFT JOIN job_apply_statuses jas
    ON jas.job_id = a.job_id
   AND jas.apply_status_id = a.status_id
   AND jas.deleted_at IS NULL
  WHERE a.job_id = $1
    AND a.deleted_at IS NULL
`,

  softDeleteByJobId: `
  UPDATE job_apply_statuses
  SET
    deleted_at = NOW(),
    deleted_by = $2,
    updated_at = NOW(),
    updated_by = $2
  WHERE job_id = $1
    AND deleted_at IS NULL
  RETURNING id
`,

  createWithClient: `
  INSERT INTO job_apply_statuses (
    job_id,
    apply_status_id,
    sort_order,
    is_default,
    is_final,
    is_active,
    created_at,
    created_by,
    updated_at,
    updated_by
  )
  VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, NOW(), $7)
  RETURNING id
`,
};
