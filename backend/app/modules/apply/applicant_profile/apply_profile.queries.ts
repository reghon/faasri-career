const SELECT_FIELDS = `
  aps.id, aps.apply_id, aps.full_name, aps.email, aps.birth_place, aps.birth_date, aps.gender,
  aps.phone_code, aps.phone, aps.address, aps.kelurahan, aps.kecamatan, aps.city,
  aps.province, aps.postal_code, aps.linkedin_url, aps.cv_url, aps.cv_file_name
`;

const INSERT_FIELDS = `
  apply_id, full_name, email, birth_place, birth_date, gender,
  phone_code, phone, address, kelurahan, kecamatan, city,
  province, postal_code, linkedin_url, cv_url, cv_file_name,
  created_at, created_by, updated_at, updated_by
`;

export const applyProfileQueries = {
  getByApplyId: `
  SELECT
    ${SELECT_FIELDS},
    a.job_id,
    j.title AS job_title,
    jl.name AS job_location,
    a.applied_at
  FROM apply_profile_snapshots aps
  JOIN applies a ON a.id = aps.apply_id
  LEFT JOIN jobs j ON j.id = a.job_id
  LEFT JOIN job_locations jl ON jl.id = j.job_location_id
  WHERE aps.apply_id = $1
    AND aps.deleted_at IS NULL
    AND a.deleted_at IS NULL
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
    RETURNING ${INSERT_FIELDS.replace(", created_at, created_by, updated_at, updated_by", "")}
  `,
};
