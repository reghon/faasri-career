const SELECT_FIELDS = `id, applicant_profile_id, skill_name, is_active`;
const INSERT_FIELDS = `applicant_profile_id, skill_name, is_active, created_at, created_by, updated_at, updated_by`;

export const technicalSkillQueries = {
  getByProfileId: `
    SELECT ${SELECT_FIELDS}
    FROM technical_skills
    WHERE applicant_profile_id = $1
      AND deleted_at IS NULL
    ORDER BY updated_at DESC
  `,
  getById: `
    SELECT ${SELECT_FIELDS}
    FROM technical_skills
    WHERE id = $1
      AND applicant_profile_id = $2
      AND deleted_at IS NULL
    LIMIT 1
  `,
  create: `
    INSERT INTO technical_skills (${INSERT_FIELDS})
    VALUES ($1, $2, TRUE, NOW(), $3, NOW(), $3)
    RETURNING ${SELECT_FIELDS}
  `,
  softDelete: `
    UPDATE technical_skills
    SET deleted_at = NOW(), deleted_by = $3, updated_at = NOW(), updated_by = $3
    WHERE id = $1
      AND applicant_profile_id = $2
      AND deleted_at IS NULL
    RETURNING id
  `,
};
