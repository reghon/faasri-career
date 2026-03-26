export const educationQueries = {
  getByProfileId: `SELECT * FROM educations WHERE applicant_profile_id = $1 ORDER BY "startYear" DESC`,
  create: `
    INSERT INTO educations (
      id, level, country, institution, major, "isStillStudying",
      "startDay", "startMonth", "startYear", "endDay", "endMonth", "endYear",
      gpa, "gpaScale", "updatedBy", "createdAt", "updatedAt", applicant_profile_id
    ) VALUES (
      gen_random_uuid(), $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10, $11,
      $12, $13, $14, NOW(), NOW(), $15
    ) RETURNING *
  `,
  update: `
    UPDATE educations SET
      level = $1, country = $2, institution = $3, major = $4,
      "isStillStudying" = $5,
      "startDay" = $6, "startMonth" = $7, "startYear" = $8,
      "endDay" = $9, "endMonth" = $10, "endYear" = $11,
      gpa = $12, "gpaScale" = $13, "updatedAt" = NOW()
    WHERE id = $14 AND applicant_profile_id = $15
    RETURNING *
  `,
  delete: `DELETE FROM educations WHERE id = $1 AND applicant_profile_id = $2`,
};