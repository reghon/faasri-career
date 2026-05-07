export const dashboardQueries = {
  getActiveJobsCount: `
    SELECT COUNT(j.id)::int AS total
    FROM jobs j
    LEFT JOIN job_statuses js ON js.id = j.status_id
    WHERE js.code = 'OPEN'
      AND j.deleted_at IS NULL
  `,

  getTotalApplicantsCount: `
    SELECT COUNT(id)::int AS total
    FROM applicant_profiles
    WHERE deleted_at IS NULL
  `,

  getApplicationsInProcessCount: `
    SELECT COUNT(a.id)::int AS total
    FROM applies a
    LEFT JOIN jobs j ON j.id = a.job_id
    LEFT JOIN job_statuses js ON js.id = j.status_id
    LEFT JOIN job_apply_statuses jas ON jas.id = a.status_id
    WHERE js.code = 'OPEN'
      AND COALESCE(jas.is_final, false) = false
      AND a.deleted_at IS NULL
      AND j.deleted_at IS NULL
  `,

  getOpenPositionsCount: `
    SELECT COALESCE(SUM(j.vacancy_count), 0)::int AS total
    FROM jobs j
    LEFT JOIN job_statuses js ON js.id = j.status_id
    WHERE js.code = 'OPEN'
      AND j.deleted_at IS NULL
  `,

  getRecruitmentFunnel: `
  SELECT
    aps.id AS status_id,
    aps.code,
    aps.name,
    COUNT(a.id)::int AS total
  FROM apply_statuses aps
  LEFT JOIN applies a
    ON a.status_id = aps.id
    AND a.deleted_at IS NULL
  LEFT JOIN jobs j
    ON j.id = a.job_id
    AND j.deleted_at IS NULL
  LEFT JOIN job_statuses js
    ON js.id = j.status_id
    AND LOWER(js.code) = 'open'
  WHERE aps.deleted_at IS NULL
    AND aps.is_active = true
  GROUP BY aps.id, aps.code, aps.name
  ORDER BY total DESC, aps.name ASC
`,
  getJobHiringPerformance: `
  SELECT
    j.id AS job_id,
    j.title AS job_title,
    COALESCE(j.vacancy_count, 0)::int AS vacancy_count,
    COUNT(a.id)::int AS applicant_count
  FROM jobs j
  LEFT JOIN job_statuses js
    ON js.id = j.status_id
  LEFT JOIN applies a
    ON a.job_id = j.id
    AND a.deleted_at IS NULL
  WHERE LOWER(js.code) = 'open'
    AND j.deleted_at IS NULL
  GROUP BY j.id, j.title, j.vacancy_count
  ORDER BY applicant_count ASC, j.created_at DESC
`,
};
