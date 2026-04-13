const SELECT_FIELDS = `
  id, apply_id, skill_name, sort_order
`;

const INSERT_FIELDS = `
  apply_id, skill_name, sort_order,
  created_at, created_by, updated_at, updated_by
`;

export const applyTechnicalSkillQueries = {
  getByApplyId: `
    SELECT ${SELECT_FIELDS}
    FROM apply_technical_skill_snapshots
    WHERE apply_id = $1
      AND deleted_at IS NULL
    ORDER BY sort_order ASC, created_at ASC
  `,

  bulkInsert: `
    INSERT INTO apply_technical_skill_snapshots (${INSERT_FIELDS})
    VALUES %L
    RETURNING ${SELECT_FIELDS}
  `,
};
