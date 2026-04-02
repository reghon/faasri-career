const SELECT_FIELDS = `
  id, user_id, full_name, birth_place, birth_date, gender,
  phone_code, phone, address, kelurahan, kecamatan, city,
  province, postal_code, is_same_address, linkedin_url,
  avatar_url, cv_url, cv_file_name, job_source, is_active
`;

const INSERT_FIELDS = `
  user_id, is_active, created_at, created_by, updated_at, updated_by
`;

export const applicantProfileQueries = {
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
      birth_place = $2,
      birth_date = $3,
      gender = $4,
      phone_code = $5,
      phone = $6,
      address = $7,
      kelurahan = $8,
      kecamatan = $9,
      city = $10,
      province = $11,
      postal_code = $12,
      is_same_address = $13,
      linkedin_url = $14,
      updated_at = NOW(),
      updated_by = $15
    WHERE user_id = $16
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,
};
