const SELECT_FIELDS = `
  id, apply_id, from_status_id, to_status_id,
  notes, changed_at, changed_by
`;

const INSERT_FIELDS = `
  apply_id, from_status_id, to_status_id,
  notes, changed_at, changed_by,
  created_at, created_by, updated_at, updated_by
`;

export const applyStatusHistoryQueries = {
  getByApplyId: `
    SELECT ${SELECT_FIELDS}
    FROM apply_status_histories
    WHERE apply_id = $1
      AND deleted_at IS NULL
    ORDER BY changed_at ASC, created_at ASC
  `,

  create: `
    INSERT INTO apply_status_histories (${INSERT_FIELDS})
    VALUES ($1, $2, $3, $4, NOW(), $5, NOW(), $5, NOW(), $5)
    RETURNING ${SELECT_FIELDS}
  `,
};
