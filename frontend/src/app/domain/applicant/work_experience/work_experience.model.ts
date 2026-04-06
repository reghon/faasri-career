export interface WorkExperience {
  id: string;
  applicantProfileId: string;
  company: string | null;
  industry: string | null;
  position: string | null;
  employmentType: string | null;
  jobLevel: string | null;
  teamSize: string | null;
  startDay: string | null;
  startMonth: string | null;
  startYear: string | null;
  endDay: string | null;
  endMonth: string | null;
  endYear: string | null;
  isCurrentJob: boolean;
  responsibilities: string | null;
  leaveReason: string | null;
  referenceName: string | null;
  referencePosition: string | null;
  referencePhoneCode: string | null;
  referencePhone: string | null;
  referenceEmail: string | null;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface WorkExperiencePayload {
  company: string | null;
  industry: string | null;
  position: string | null;
  employmentType: string | null;
  jobLevel: string | null;
  teamSize: string | null;
  startDay: string | null;
  startMonth: string | null;
  startYear: string | null;
  endDay: string | null;
  endMonth: string | null;
  endYear: string | null;
  isCurrentJob: boolean;
  responsibilities: string | null;
  leaveReason: string | null;
  referenceName: string | null;
  referencePosition: string | null;
  referencePhoneCode: string | null;
  referencePhone: string | null;
  referenceEmail: string | null;
}
