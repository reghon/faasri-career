const SELECT_FIELDS = `
  id, applicant_profile_id, level, country, institution, major,
  is_still_studying, start_day, start_month, start_year,
  end_day, end_month, end_year, gpa, gpa_scale
`;

const INSERT_FIELDS = `
  applicant_profile_id, level, country, institution, major,
  is_still_studying, start_day, start_month, start_year,
  end_day, end_month, end_year, gpa, gpa_scale,
  created_at, created_by, updated_at, updated_by
`;

export const educationQueries = {
  getByProfileId: `
    SELECT ${SELECT_FIELDS}
    FROM educations
    WHERE applicant_profile_id = $1
      AND deleted_at IS NULL
    ORDER BY
      CASE WHEN start_year ~ '^[0-9]+$' THEN start_year::INT ELSE NULL END DESC NULLS LAST,
      updated_at DESC
  `,

  getById: `
    SELECT ${SELECT_FIELDS}
    FROM educations
    WHERE id = $1
      AND applicant_profile_id = $2
      AND deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO educations (${INSERT_FIELDS})
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), $15, NOW(), $15)
    RETURNING ${SELECT_FIELDS}
  `,

  update: `
    UPDATE educations
    SET
      level = $1,
      country = $2,
      institution = $3,
      major = $4,
      is_still_studying = $5,
      start_day = $6,
      start_month = $7,
      start_year = $8,
      end_day = $9,
      end_month = $10,
      end_year = $11,
      gpa = $12,
      gpa_scale = $13,
      updated_at = NOW(),
      updated_by = $14
    WHERE id = $15
      AND applicant_profile_id = $16
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,

  softDelete: `
    UPDATE educations
    SET deleted_at = NOW(), deleted_by = $3, updated_at = NOW(), updated_by = $3
    WHERE id = $1
      AND applicant_profile_id = $2
      AND deleted_at IS NULL
    RETURNING id
  `,
};
