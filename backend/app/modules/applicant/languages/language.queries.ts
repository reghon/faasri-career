export const languageQueries = {
  getByProfileId: `SELECT * FROM languages WHERE applicant_profile_id = $1`,
  create: `
    INSERT INTO languages (id, language, proficiency, "updatedBy", "createdAt", "updatedAt", applicant_profile_id)
    VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW(), $4)
    RETURNING *
  `,
  update: `
    UPDATE languages SET language = $1, proficiency = $2, "updatedAt" = NOW()
    WHERE id = $3 AND applicant_profile_id = $4
    RETURNING *
  `,
  delete: `DELETE FROM languages WHERE id = $1 AND applicant_profile_id = $2`,
};
