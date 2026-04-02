export const applicantProfileQueries = {
    getProfileByUserId: `
    SELECT *
    FROM applicant_profiles
    WHERE user_id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  updateProfile: `
    UPDATE applicant_profiles SET
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
      updated_at = NOW()
    WHERE user_id = $15
      AND deleted_at IS NULL
    RETURNING *
  `,

  createProfile: `
    INSERT INTO applicant_profiles (
      id, user_id, is_active, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), $1, TRUE, NOW(), NOW()
    )
    RETURNING *
  `,
};
