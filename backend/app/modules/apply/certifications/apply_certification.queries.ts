const SELECT_FIELDS = `
  id, apply_id, name, issuer,
  issued_day, issued_month, issued_year,
  expired_day, expired_month, expired_year,
  sort_order
`;

const INSERT_FIELDS = `
  apply_id, name, issuer,
  issued_day, issued_month, issued_year,
  expired_day, expired_month, expired_year,
  sort_order,
  created_at, created_by, updated_at, updated_by
`;

export const applyCertificationQueries = {
  getByApplyId: `
    SELECT ${SELECT_FIELDS}
    FROM apply_certification_snapshots
    WHERE apply_id = $1
      AND deleted_at IS NULL
    ORDER BY sort_order ASC, created_at ASC
  `,

  bulkInsert: `
    INSERT INTO apply_certification_snapshots (${INSERT_FIELDS})
    VALUES %L
    RETURNING ${SELECT_FIELDS}
  `,
};
