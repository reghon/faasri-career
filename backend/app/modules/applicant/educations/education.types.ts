export type Education = {
  id: string;
  applicantProfileId: string;
  level: string | null;
  country: string | null;
  institution: string | null;
  major: string | null;
  isStillStudying: boolean;
  startDay: string | null;
  startMonth: string | null;
  startYear: string | null;
  endDay: string | null;
  endMonth: string | null;
  endYear: string | null;
  gpa: string | null;
  gpaScale: string | null;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};

export type EducationPayload = {
  level: string | null;
  country: string | null;
  institution: string | null;
  major: string | null;
  isStillStudying: boolean;
  startDay: string | null;
  startMonth: string | null;
  startYear: string | null;
  endDay: string | null;
  endMonth: string | null;
  endYear: string | null;
  gpa: string | null;
  gpaScale: string | null;
};

export type EducationParams = {
  id: string;
};
