const SELECT_FIELDS = `
  id, user_id, full_name, email, birth_place, birth_date, gender,
  phone_code, phone, address, kelurahan, kecamatan, city,
  province, postal_code, linkedin_url,
  avatar_url, cv_url, cv_file_name, is_active
`;

const INSERT_FIELDS = `
  user_id, is_active, created_at, created_by, updated_at, updated_by
`;

export const applicantProfileQueries = {
  getAll: `
  SELECT ${SELECT_FIELDS}
  FROM applicant_profiles
  WHERE deleted_at IS NULL
  ORDER BY created_at DESC
`,

  getByUserId: `
    SELECT ${SELECT_FIELDS}
    FROM applicant_profiles
    WHERE user_id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO applicant_profiles (${INSERT_FIELDS})
    VALUES ($1, TRUE, NOW(), $2, NOW(), $2)
    RETURNING ${SELECT_FIELDS}
  `,

  update: `
    UPDATE applicant_profiles
    SET
      full_name = $1,
      email = $2,
      birth_place = $3,
      birth_date = $4,
      gender = $5,
      phone_code = $6,
      phone = $7,
      address = $8,
      kelurahan = $9,
      kecamatan = $10,
      city = $11,
      province = $12,
      postal_code = $13,
      linkedin_url = $14,
      updated_at = NOW(),
      updated_by = $15
    WHERE user_id = $16
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,

  updateAvatar: `
    UPDATE applicant_profiles
    SET
      avatar_url = $1,
      updated_at = NOW(),
      updated_by = $2
    WHERE user_id = $3
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,

  updateCv: `
    UPDATE applicant_profiles
    SET
      cv_url = $1,
      cv_file_name = $2,
      updated_at = NOW(),
      updated_by = $3
    WHERE user_id = $4
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,

  removeAvatar: `
  UPDATE applicant_profiles
  SET
    avatar_url = NULL,
    updated_at = NOW(),
    updated_by = $1
  WHERE user_id = $2
    AND deleted_at IS NULL
  RETURNING ${SELECT_FIELDS}
`,

  removeCv: `
  UPDATE applicant_profiles
  SET
    cv_url = NULL,
    cv_file_name = NULL,
    updated_at = NOW(),
    updated_by = $1
  WHERE user_id = $2
    AND deleted_at IS NULL
  RETURNING ${SELECT_FIELDS}
`,
};
