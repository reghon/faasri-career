const SELECT_FIELDS = `
  id, applicant_profile_id, company, industry, position, employment_type,
  job_level, team_size, start_day, start_month, start_year, end_day,
  end_month, end_year, is_current_job, responsibilities, leave_reason,
  reference_name, reference_position, reference_phone_code, reference_phone,
  reference_email
`;

const INSERT_FIELDS = `
  applicant_profile_id, company, industry, position, employment_type,
  job_level, team_size, start_day, start_month, start_year, end_day,
  end_month, end_year, is_current_job, responsibilities, leave_reason,
  reference_name, reference_position, reference_phone_code, reference_phone,
  reference_email, is_active, created_at, created_by, updated_at, updated_by
`;

export const workExperienceQueries = {
  getByProfileId: `
    SELECT ${SELECT_FIELDS}
    FROM work_experiences
    WHERE applicant_profile_id = $1
      AND deleted_at IS NULL
      AND is_active = TRUE
    ORDER BY
      CASE WHEN start_year ~ '^[0-9]+$' THEN start_year::INT ELSE NULL END DESC NULLS LAST,
      updated_at DESC
  `,
  getById: `
    SELECT ${SELECT_FIELDS}
    FROM work_experiences
    WHERE id = $1
      AND applicant_profile_id = $2
      AND deleted_at IS NULL
      AND is_active = TRUE
    LIMIT 1
  `,
  create: `
    INSERT INTO work_experiences (${INSERT_FIELDS})
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, TRUE, NOW(), $22, NOW(), $22)
    RETURNING ${SELECT_FIELDS}
  `,
  update: `
    UPDATE work_experiences
    SET
      company = $1,
      industry = $2,
      position = $3,
      employment_type = $4,
      job_level = $5,
      team_size = $6,
      start_day = $7,
      start_month = $8,
      start_year = $9,
      end_day = $10,
      end_month = $11,
      end_year = $12,
      is_current_job = $13,
      responsibilities = $14,
      leave_reason = $15,
      reference_name = $16,
      reference_position = $17,
      reference_phone_code = $18,
      reference_phone = $19,
      reference_email = $20,
      updated_at = NOW(),
      updated_by = $21
    WHERE id = $22
      AND applicant_profile_id = $23
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,
  softDelete: `
    UPDATE work_experiences
    SET deleted_at = NOW(), deleted_by = $3, updated_at = NOW(), updated_by = $3, is_active = FALSE
    WHERE id = $1
      AND applicant_profile_id = $2
      AND deleted_at IS NULL
    RETURNING id
  `,
};
