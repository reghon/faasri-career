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
};
