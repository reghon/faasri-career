const SELECT_FIELDS = `
  id, apply_id, full_name, email, birth_place, birth_date, gender,
  phone_code, phone, address, kelurahan, kecamatan, city,
  province, postal_code, linkedin_url, cv_url, cv_file_name
`;

const INSERT_FIELDS = `
  apply_id, full_name, email, birth_place, birth_date, gender,
  phone_code, phone, address, kelurahan, kecamatan, city,
  province, postal_code, linkedin_url, cv_url, cv_file_name,
  created_at, created_by, updated_at, updated_by
`;

export const applyProfileQueries = {
  getByApplyId: `
    SELECT ${SELECT_FIELDS}
    FROM apply_profile_snapshots
    WHERE apply_id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO apply_profile_snapshots (${INSERT_FIELDS})
    VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17,
      NOW(), $18, NOW(), $18
    )
    RETURNING ${SELECT_FIELDS}
  `,
};
