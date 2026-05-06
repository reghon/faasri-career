export interface Apply {
  id: string;
  applicantProfileId: string;
  jobId: string;
  statusId: string;
  applicationCode: string | null;
  notes: string | null;
  appliedAt: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

/**
 * Payload untuk create apply
 */
export interface CreateApplyPayload {
  jobId: string;

  personalInfo: {
    fullName: string | null;
    email: string | null;
    birthPlace: string | null;
    birthDate: string | null;
    gender: string | null;
    phoneCode: string | null;
    phone: string | null;
    address: string | null;
    kelurahan: string | null;
    kecamatan: string | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
    linkedinUrl: string | null;
    cvUrl: string | null;
    cvFileName: string | null;
  };

  educationInfo: {
    educations: {
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
    }[];
  };

  experienceInfo: {
    hasExperience: boolean;
    currentSalary: string | null;
    technicalSkillsDescription: string | null;

    technicalSkills: {
      skillName: string | null;
    }[];

    certifications: {
      name: string | null;
      issuer: string | null;
      issuedDay: string | null;
      issuedMonth: string | null;
      issuedYear: string | null;
      expiredDay: string | null;
      expiredMonth: string | null;
      expiredYear: string | null;
    }[];

    languages: {
      language: string | null;
      proficiency: string | null;
    }[];

    experiences: {
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
    }[];
  };
}

/**
 * Update status (HR)
 */
export interface UpdateApplyStatusPayload {
  statusId: string;
  notes: string | null;
}

export interface ApplyByJobItem extends Apply {
  applicantName: string | null;
  email: string | null;
  phoneCode: string | null;
  phone: string | null;
  cvUrl: string | null;
  cvFileName: string | null;
  linkedinUrl: string | null;
  statusCode: string | null;
  statusName: string | null;
  statusSortOrder: number | null;
}

export type ApplyListItem = {
  id: string;
  applicantProfileId: string;
  jobId: string;
  statusId: string;

  fullName: string | null;
  linkedinUrl: string | null;
  jobName: string | null;
  statusName: string | null;

  appliedAt: string;
  statusUpdatedAt: string | null;
};

export interface ApplyHistoryList {
  id: string;
  applicantProfileId: string;
  jobId: string;
  jobName: string;
  jobLocation: string;
  statusId: string;
  statusName: string;
  appliedAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApplyMeDetail extends Apply {
  job: {
    id: string;
    title: string | null;
  } | null;

  currentStatus: {
    id: string;
    code: string | null;
    name: string | null;
    sortOrder: number | null;
  } | null;

  stages: {
    id: string;
    applyStatusId: string;
    code: string | null;
    name: string | null;
    sortOrder: number | null;
    isDefault: boolean | null;
    isFinal: boolean | null;
  }[];

  histories: {
    id: string;
    applyId: string;
    applyStatusId: string;
    applyStatusName: string | null;
    notes: string | null;
    createdAt: string;
  }[];
}
