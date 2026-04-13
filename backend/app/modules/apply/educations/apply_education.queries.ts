const SELECT_FIELDS = `
  id, apply_id, level, country, institution, major,
  is_still_studying,
  start_day, start_month, start_year,
  end_day, end_month, end_year,
  gpa, gpa_scale,
  sort_order
`;

const INSERT_FIELDS = `
  apply_id, level, country, institution, major,
  is_still_studying,
  start_day, start_month, start_year,
  end_day, end_month, end_year,
  gpa, gpa_scale,
  sort_order,
  created_at, created_by, updated_at, updated_by
`;

export const applyEducationQueries = {
  getByApplyId: `
    SELECT ${SELECT_FIELDS}
    FROM apply_education_snapshots
    WHERE apply_id = $1
      AND deleted_at IS NULL
    ORDER BY sort_order ASC, created_at ASC
  `,

  bulkInsert: `
    INSERT INTO apply_education_snapshots (${INSERT_FIELDS})
    VALUES %L
    RETURNING ${SELECT_FIELDS}
  `,
};
