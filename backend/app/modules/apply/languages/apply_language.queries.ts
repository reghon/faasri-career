const SELECT_FIELDS = `
  id, apply_id, language, proficiency, sort_order
`;

const INSERT_FIELDS = `
  apply_id, language, proficiency, sort_order,
  created_at, created_by, updated_at, updated_by
`;

export const applyLanguageQueries = {
  getByApplyId: `
    SELECT ${SELECT_FIELDS}
    FROM apply_language_snapshots
    WHERE apply_id = $1
      AND deleted_at IS NULL
    ORDER BY sort_order ASC, created_at ASC
  `,

  bulkInsert: `
    INSERT INTO apply_language_snapshots (${INSERT_FIELDS})
    VALUES %L
    RETURNING ${SELECT_FIELDS}
  `,
};
