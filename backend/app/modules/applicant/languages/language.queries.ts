const SELECT_FIELDS = `id, applicant_profile_id, language, proficiency, is_active`;
const INSERT_FIELDS = `applicant_profile_id, language, proficiency, is_active, created_at, created_by, updated_at, updated_by`;

export const languageQueries = {
  getByProfileId: `
    SELECT ${SELECT_FIELDS}
    FROM languages
    WHERE applicant_profile_id = $1
      AND deleted_at IS NULL
    ORDER BY updated_at DESC
  `,
  getById: `
    SELECT ${SELECT_FIELDS}
    FROM languages
    WHERE id = $1
      AND applicant_profile_id = $2
      AND deleted_at IS NULL
    LIMIT 1
  `,
  create: `
    INSERT INTO languages (${INSERT_FIELDS})
    VALUES ($1, $2, $3, TRUE, NOW(), $4, NOW(), $4)
    RETURNING ${SELECT_FIELDS}
  `,
  update: `
    UPDATE languages
    SET language = $1, proficiency = $2, updated_at = NOW(), updated_by = $3
    WHERE id = $4
      AND applicant_profile_id = $5
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,
  softDelete: `
    UPDATE languages
    SET deleted_at = NOW(), deleted_by = $3, updated_at = NOW(), updated_by = $3, is_active = FALSE 
    WHERE id = $1
      AND applicant_profile_id = $2
      AND deleted_at IS NULL
    RETURNING id
  `,
};
