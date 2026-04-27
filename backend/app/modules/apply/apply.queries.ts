const SELECT_FIELDS = `
  id, applicant_profile_id, job_id, status_id,
  application_code, notes, applied_at, is_active
`;

const INSERT_FIELDS = `
  applicant_profile_id, job_id, status_id,
  application_code, notes, applied_at,
  is_active, created_at, created_by, updated_at, updated_by
`;

export const applyQueries = {
  getMine: `
  SELECT ${SELECT_FIELDS}
  FROM applies
  WHERE applicant_profile_id = $1
    AND deleted_at IS NULL
  ORDER BY applied_at DESC, created_at DESC
`,

  getById: `
    SELECT ${SELECT_FIELDS}
    FROM applies
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByApplicantProfileId: `
    SELECT ${SELECT_FIELDS}
    FROM applies
    WHERE applicant_profile_id = $1
      AND deleted_at IS NULL
    ORDER BY applied_at DESC, created_at DESC
  `,

  create: `
    INSERT INTO applies (${INSERT_FIELDS})
    VALUES ($1, $2, $3, $4, $5, NOW(), TRUE, NOW(), $6, NOW(), $6)
    RETURNING ${SELECT_FIELDS}
  `,

  updateStatus: `
    UPDATE applies
    SET
      status_id = $1,
      notes = $2,
      updated_at = NOW(),
      updated_by = $3
    WHERE id = $4
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,

  getByJobId: `
  SELECT
    a.id,
    a.applicant_profile_id,
    a.job_id,
    a.status_id,
    a.application_code,
    a.notes,
    a.applied_at,
    a.is_active,
    a.created_at,
    a.created_by,
    a.updated_at,
    a.updated_by,
    a.deleted_at,
    a.deleted_by,

    ap.full_name AS applicant_name,
    ap.email,
    ap.phone_code,
    ap.phone,
    ap.cv_url,
    ap.cv_file_name,
    ap.linkedin_url,

    s.code AS status_code,
    s.name AS status_name,
    s.sort_order AS status_sort_order

  FROM applies a
  LEFT JOIN applicant_profiles ap
    ON ap.id = a.applicant_profile_id
   AND ap.deleted_at IS NULL
  LEFT JOIN apply_statuses s
    ON s.id = a.status_id
   AND s.deleted_at IS NULL

  WHERE a.job_id = $1
    AND a.deleted_at IS NULL

  ORDER BY s.sort_order ASC, a.applied_at DESC, a.created_at DESC
`,
};
