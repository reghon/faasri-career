export const certificationQueries = {
  getByProfileId: `SELECT * FROM certifications WHERE applicant_profile_id = $1 ORDER BY "issuedYear" DESC`,
  create: `
    INSERT INTO certifications (
      id, name, issuer,
      "issuedDay", "issuedMonth", "issuedYear",
      "expiredDay", "expiredMonth", "expiredYear",
      "updatedBy", "createdAt", "updatedAt", applicant_profile_id
    ) VALUES (
      gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), $10
    ) RETURNING *
  `,
  update: `
    UPDATE certifications SET
      name = $1, issuer = $2,
      "issuedDay" = $3, "issuedMonth" = $4, "issuedYear" = $5,
      "expiredDay" = $6, "expiredMonth" = $7, "expiredYear" = $8,
      "updatedAt" = NOW()
    WHERE id = $9 AND applicant_profile_id = $10
    RETURNING *
  `,
  delete: `DELETE FROM certifications WHERE id = $1 AND applicant_profile_id = $2`,
};
