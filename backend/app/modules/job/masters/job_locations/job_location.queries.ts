const SELECT_FIELDS = `
  id, code, name, city, province, country, address, postal_code, is_active
`;

const DETAIL_FIELDS = `
  id, code, name, city, province, country, address, postal_code, is_active,
  created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
`;

const INSERT_FIELDS = `
  code, name, city, province, country, address, postal_code,
  is_active, created_at, created_by, updated_at, updated_by
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

  getDetailById: `
    SELECT ${DETAIL_FIELDS}
    FROM job_locations
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByName: `
    SELECT id, name, code
    FROM job_locations
    WHERE LOWER(name) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  getByCode: `
    SELECT id, name, code
    FROM job_locations
    WHERE LOWER(code) = LOWER($1)
      AND deleted_at IS NULL
    LIMIT 1
  `,

  create: `
    INSERT INTO job_locations (${INSERT_FIELDS})
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, NOW(), $9)
    RETURNING ${SELECT_FIELDS}
  `,

  update: `
    UPDATE job_locations
    SET
      code = $1,
      name = $2,
      city = $3,
      province = $4,
      country = $5,
      address = $6,
      postal_code = $7,
      is_active = $8,
      updated_at = NOW(),
      updated_by = $9
    WHERE id = $10
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
    RETURNING ${DETAIL_FIELDS}
  `,
};
