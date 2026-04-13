const SELECT_FIELDS = `
  id, apply_id, company, industry, position, employment_type,
  job_level, team_size, start_day, start_month, start_year,
  end_day, end_month, end_year, is_current_job, responsibilities,
  leave_reason, reference_name, reference_position,
  reference_phone_code, reference_phone, reference_email,
  sort_order
`;

const INSERT_FIELDS = `
  apply_id, company, industry, position, employment_type,
  job_level, team_size, start_day, start_month, start_year,
  end_day, end_month, end_year, is_current_job, responsibilities,
  leave_reason, reference_name, reference_position,
  reference_phone_code, reference_phone, reference_email,
  sort_order,
  created_at, created_by, updated_at, updated_by
`;

export const applyWorkExperienceQueries = {
  getByApplyId: `
    SELECT ${SELECT_FIELDS}
    FROM apply_work_experience_snapshots
    WHERE apply_id = $1
      AND deleted_at IS NULL
    ORDER BY sort_order ASC, created_at ASC
  `,

  bulkInsert: `
    INSERT INTO apply_work_experience_snapshots (${INSERT_FIELDS})
    VALUES %L
    RETURNING ${SELECT_FIELDS}
  `,
};
