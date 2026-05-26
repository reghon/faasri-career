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
  getAll: `
  SELECT
    a.id,
    a.applicant_profile_id,
    a.job_id,
    a.status_id,

    ap.full_name,
    ap.linkedin_url,

    j.title AS job_name,

    aps.name AS status_name,

    a.applied_at,
    jas.updated_at AS status_updated_at

  FROM applies a

  LEFT JOIN applicant_profiles ap
    ON ap.id = a.applicant_profile_id
   AND ap.deleted_at IS NULL

  LEFT JOIN jobs j
    ON j.id = a.job_id
   AND j.deleted_at IS NULL

  LEFT JOIN apply_statuses aps
    ON aps.id = a.status_id
   AND aps.deleted_at IS NULL

  LEFT JOIN job_apply_statuses jas
    ON jas.job_id = a.job_id
   AND jas.apply_status_id = a.status_id
   AND jas.deleted_at IS NULL

  WHERE a.deleted_at IS NULL

  ORDER BY a.applied_at DESC, a.created_at DESC
`,
  getMine: `
  SELECT 
    a.id,
    a.applicant_profile_id,
    a.job_id,
    j.title AS job_name,
    jl.name AS job_location,
    a.status_id,
    s.name AS status_name,
    jas.is_final AS status_is_final,
    a.applied_at,
    a.is_active,
    a.created_at,
    a.updated_at
  FROM applies a
  LEFT JOIN apply_statuses s 
    ON s.id = a.status_id
   AND s.deleted_at IS NULL
  LEFT JOIN jobs j
    ON j.id = a.job_id
   AND j.deleted_at IS NULL
  LEFT JOIN job_locations jl
    ON jl.id = j.job_location_id
  LEFT JOIN job_apply_statuses jas
    ON jas.job_id = a.job_id
   AND jas.apply_status_id = a.status_id
   AND jas.deleted_at IS NULL
  WHERE a.applicant_profile_id = $1
    AND a.deleted_at IS NULL
  ORDER BY a.applied_at DESC, a.created_at DESC
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

    jas.sort_order AS status_sort_order,
    jas.is_default AS status_is_default,
    jas.is_final AS status_is_final

  FROM applies a
  LEFT JOIN applicant_profiles ap
    ON ap.id = a.applicant_profile_id
   AND ap.deleted_at IS NULL

  LEFT JOIN apply_statuses s
    ON s.id = a.status_id
   AND s.deleted_at IS NULL

  LEFT JOIN job_apply_statuses jas
    ON jas.job_id = a.job_id
   AND jas.apply_status_id = a.status_id
   AND jas.deleted_at IS NULL

  WHERE a.job_id = $1
    AND a.deleted_at IS NULL

  ORDER BY jas.sort_order ASC NULLS LAST, a.applied_at DESC, a.created_at DESC
`,
  getMineDetail: `
  SELECT
    a.id,
    a.applicant_profile_id,
    a.job_id,
    a.status_id,
    a.application_code,
    a.notes,
    a.applied_at,
    a.is_active,

    j.id AS job_id_detail,
    j.title AS job_title,

    s.id AS current_status_id,
    s.code AS current_status_code,
    s.name AS current_status_name,
    jas_current.sort_order AS current_status_sort_order,

    COALESCE(
      (
        SELECT json_agg(
          json_build_object(
            'id', jas.id,
            'applyStatusId', jas.apply_status_id,
            'code', aps.code,
            'name', aps.name,
            'sortOrder', jas.sort_order,
            'isDefault', jas.is_default,
            'isFinal', jas.is_final
          )
          ORDER BY jas.sort_order ASC
        )
        FROM job_apply_statuses jas
        LEFT JOIN apply_statuses aps
          ON aps.id = jas.apply_status_id
         AND aps.deleted_at IS NULL
        WHERE jas.job_id = a.job_id
          AND jas.deleted_at IS NULL
      ),
      '[]'::json
    ) AS stages,

    COALESCE(
      (
        SELECT json_agg(
          json_build_object(
            'id', ash.id,
            'applyId', ash.apply_id,
            'applyStatusId', ash.apply_status_id,
            'applyStatusName', ash.apply_status_name,
            'notes', ash.notes,
            'createdAt', ash.created_at
          )
          ORDER BY ash.created_at ASC
        )
        FROM apply_status_histories ash
        WHERE ash.apply_id = a.id
          AND ash.deleted_at IS NULL
      ),
      '[]'::json
    ) AS histories

  FROM applies a

  LEFT JOIN jobs j
    ON j.id = a.job_id
   AND j.deleted_at IS NULL

  LEFT JOIN apply_statuses s
    ON s.id = a.status_id
   AND s.deleted_at IS NULL

  LEFT JOIN job_apply_statuses jas_current
    ON jas_current.job_id = a.job_id
   AND jas_current.apply_status_id = a.status_id
   AND jas_current.deleted_at IS NULL

  WHERE a.id = $1
    AND a.applicant_profile_id = $2
    AND a.deleted_at IS NULL

  LIMIT 1
`,

  hasApplied: `
  SELECT id
  FROM applies
  WHERE applicant_profile_id = $1
    AND job_id = $2
    AND deleted_at IS NULL
  LIMIT 1
`,
};
