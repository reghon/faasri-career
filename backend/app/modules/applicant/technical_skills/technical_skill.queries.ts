export const technicalSkillQueries = {
  getByProfileId: `SELECT * FROM technical_skills WHERE applicant_profile_id = $1`,
  create: `
    INSERT INTO technical_skills (id, "skillName", "updatedBy", "createdAt", "updatedAt", applicant_profile_id)
    VALUES (gen_random_uuid(), $1, $2, NOW(), NOW(), $3)
    RETURNING *
  `,
  delete: `DELETE FROM technical_skills WHERE id = $1 AND applicant_profile_id = $2`,
};
