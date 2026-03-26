export const workExperienceQueries = {
  getByProfileId: `SELECT * FROM work_experiences WHERE applicant_profile_id = $1 ORDER BY "startYear" DESC`,
  create: `
    INSERT INTO work_experiences (
      id, company, industry, position, "employmentType", "jobLevel", "teamSize",
      "startDay", "startMonth", "startYear", "endDay", "endMonth", "endYear",
      "isCurrentJob", responsibilities, "leaveReason",
      "referenceName", "referencePosition", "referencePhoneCode", "referencePhone", "referenceEmail",
      "updatedBy", "createdAt", "updatedAt", applicant_profile_id
    ) VALUES (
      gen_random_uuid(), $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15,
      $16, $17, $18, $19, $20,
      $21, NOW(), NOW(), $22
    ) RETURNING *
  `,
  update: `
    UPDATE work_experiences SET
      company = $1, industry = $2, position = $3, "employmentType" = $4,
      "jobLevel" = $5, "teamSize" = $6,
      "startDay" = $7, "startMonth" = $8, "startYear" = $9,
      "endDay" = $10, "endMonth" = $11, "endYear" = $12,
      "isCurrentJob" = $13, responsibilities = $14, "leaveReason" = $15,
      "referenceName" = $16, "referencePosition" = $17, "referencePhoneCode" = $18,
      "referencePhone" = $19, "referenceEmail" = $20,
      "updatedAt" = NOW()
    WHERE id = $21 AND applicant_profile_id = $22
    RETURNING *
  `,
  delete: `DELETE FROM work_experiences WHERE id = $1 AND applicant_profile_id = $2`,
};
