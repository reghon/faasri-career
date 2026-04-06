const SELECT_FIELDS = `
  id, name, city, province, country, address, postal_code, is_active,
  created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
`;

const INSERT_FIELDS = `
  name, city, province, country, address, postal_code, is_active,
  created_at, created_by, updated_at, updated_by
`;

export const jobLocationQueries = {
  getAll: `
    SELECT ${SELECT_FIELDS}
    FROM job_locations
    WHERE deleted_at IS NULL
    ORDER BY name ASC
  `,

  getById: `
    SELECT ${SELECT_FIELDS}
    FROM job_locations
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByName: `
    SELECT ${SELECT_FIELDS}
    FROM job_locations
    WHERE LOWER(name) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO job_locations (${INSERT_FIELDS})
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, NOW(), $8)
    RETURNING ${SELECT_FIELDS}
  `,

  update: `
    UPDATE job_locations
    SET
      name = $1,
      city = $2,
      province = $3,
      country = $4,
      address = $5,
      postal_code = $6,
      is_active = $7,
      updated_at = NOW(),
      updated_by = $8
    WHERE id = $9
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,

  softDelete: `
    UPDATE job_locations
    SET
      deleted_at = NOW(),
      deleted_by = $2,
      updated_at = NOW(),
      updated_by = $2
    WHERE id = $1
      AND deleted_at IS NULL
    RETURNING ${SELECT_FIELDS}
  `,
};
