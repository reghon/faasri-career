export const applicantProfileQueries = {
  getProfileByUserId: `
    SELECT
      ap.*,
      json_agg(DISTINCT jsonb_build_object(
        'id', we.id,
        'company', we.company,
        'industry', we.industry,
        'position', we.position,
        'employmentType', we."employmentType",
        'jobLevel', we."jobLevel",
        'teamSize', we."teamSize",
        'startDay', we."startDay",
        'startMonth', we."startMonth",
        'startYear', we."startYear",
        'endDay', we."endDay",
        'endMonth', we."endMonth",
        'endYear', we."endYear",
        'isCurrentJob', we."isCurrentJob",
        'responsibilities', we.responsibilities,
        'leaveReason', we."leaveReason",
        'referenceName', we."referenceName",
        'referencePosition', we."referencePosition",
        'referencePhoneCode', we."referencePhoneCode",
        'referencePhone', we."referencePhone",
        'referenceEmail', we."referenceEmail"
      )) FILTER (WHERE we.id IS NOT NULL) AS "workExperiences",
      json_agg(DISTINCT jsonb_build_object(
        'id', ed.id,
        'level', ed.level,
        'country', ed.country,
        'institution', ed.institution,
        'major', ed.major,
        'isStillStudying', ed."isStillStudying",
        'startDay', ed."startDay",
        'startMonth', ed."startMonth",
        'startYear', ed."startYear",
        'endDay', ed."endDay",
        'endMonth', ed."endMonth",
        'endYear', ed."endYear",
        'gpa', ed.gpa,
        'gpaScale', ed."gpaScale"
      )) FILTER (WHERE ed.id IS NOT NULL) AS "educations",
      json_agg(DISTINCT jsonb_build_object(
        'id', ce.id,
        'name', ce.name,
        'issuer', ce.issuer,
        'issuedDay', ce."issuedDay",
        'issuedMonth', ce."issuedMonth",
        'issuedYear', ce."issuedYear",
        'expiredDay', ce."expiredDay",
        'expiredMonth', ce."expiredMonth",
        'expiredYear', ce."expiredYear"
      )) FILTER (WHERE ce.id IS NOT NULL) AS "certifications",
      json_agg(DISTINCT jsonb_build_object(
        'id', la.id,
        'language', la.language,
        'proficiency', la.proficiency
      )) FILTER (WHERE la.id IS NOT NULL) AS "languages",
      json_agg(DISTINCT jsonb_build_object(
        'id', ts.id,
        'skillName', ts."skillName"
      )) FILTER (WHERE ts.id IS NOT NULL) AS "technicalSkills"
    FROM applicant_profiles ap
    LEFT JOIN work_experiences we ON we.applicant_profile_id = ap.id
    LEFT JOIN educations ed ON ed.applicant_profile_id = ap.id
    LEFT JOIN certifications ce ON ce.applicant_profile_id = ap.id
    LEFT JOIN languages la ON la.applicant_profile_id = ap.id
    LEFT JOIN technical_skills ts ON ts.applicant_profile_id = ap.id
    WHERE ap.user_id = $1
    GROUP BY ap.id
  `,

  updateProfile: `
    UPDATE applicant_profiles SET
      "fullName" = $1,
      "birthPlace" = $2,
      "birthDate" = $3,
      gender = $4,
      "phoneCode" = $5,
      phone = $6,
      address = $7,
      kelurahan = $8,
      kecamatan = $9,
      city = $10,
      province = $11,
      "postalCode" = $12,
      "isSameAddress" = $13,
      "linkedinUrl" = $14,
      "updatedAt" = NOW()
    WHERE user_id = $15
    RETURNING *
  `,

  createProfile: `
    INSERT INTO applicant_profiles (id, user_id, "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), $1, NOW(), NOW())
    RETURNING *
  `,
};