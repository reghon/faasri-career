const SELECT_FIELDS = `
  id, applicant_profile_id, name, issuer,
  issued_day, issued_month, issued_year,
  expired_day, expired_month, expired_year
`;

const INSERT_FIELDS = `
  applicant_profile_id, name, issuer,
  issued_day, issued_month, issued_year,
  expired_day, expired_month, expired_year,
  created_at, created_by, updated_at, updated_by
`;

export const certificationQueries = {
  getByProfileId: `
    SELECT ${SELECT_FIELDS}
    FROM certifications
    WHERE applicant_profile_id = $1
      AND deleted_at IS NULL
    ORDER BY
      CASE
        WHEN issued_year ~ '^[0-9]+$' THEN issued_year::INT
        ELSE NULL
      END DESC NULLS LAST,
      updated_at DESC,
      id DESC
  `,

  getById: `
    SELECT ${SELECT_FIELDS}
    FROM certifications
    WHERE id = $1
      AND applicant_profile_id = $2
      AND deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO certifications (${INSERT_FIELDS})
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10, NOW(), $10)
    RETURNING ${SELECT_FIELDS}
  `,

  update: `
    UPDATE certifications
    SET
      name = $1,
      issuer = $2,
      issued_day = $3,
      issued_month = $4,
      issued_year = $5,
      expired_day = $6,
      expired_month = $7,
      expired_year = $8,
      updated_at = NOW(),
      updated_by = $9
    WHERE id = $10
      AND applicant_profile_id = $11
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,

  softDelete: `
    UPDATE certifications
    SET
      deleted_at = NOW(),
      deleted_by = $3,
      updated_at = NOW(),
      updated_by = $3
    WHERE id = $1
      AND applicant_profile_id = $2
      AND deleted_at IS NULL
    RETURNING id
  `,
};
