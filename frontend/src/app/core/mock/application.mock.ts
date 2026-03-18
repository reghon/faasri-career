export interface PersonalInfo {
  cvFile: File | null;
  fullName: string;
  birthPlace: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  email: string;
  phoneCode: string;
  phone: string;
  gender: string;
  address: string;
  kelurahan: string;
  kecamatan: string;
  city: string;
  province: string;
  postalCode: string;
  isSameAddress: boolean;
  linkedinUrl: string;
  jobSource: string;
}

export interface Education {
  level: string;
  country: string;
  institution: string;
  major: string;
  isStillStudying: boolean;
  startDay: string;
  startMonth: string;
  startYear: string;
  endDay: string;
  endMonth: string;
  endYear: string;
  gpa: string;
  gpaScale: string;
}

export interface WorkExperience {
  company: string;
  industry: string;
  position: string;
  employmentType: string;
  jobLevel: string;
  teamSize: string;
  startDay: string;
  startMonth: string;
  startYear: string;
  endDay: string;
  endMonth: string;
  endYear: string;
  isCurrentJob: boolean;
  responsibilities: string;
  leaveReason: string;
  referenceName: string;
  referencePosition: string;
  referencePhoneCode: string;
  referencePhone: string;
  referenceEmail: string;
}

export interface Certification {
  name: string;
  issuer: string;
  issuedDay: string;
  issuedMonth: string;
  issuedYear: string;
  expiredDay: string;
  expiredMonth: string;
  expiredYear: string;
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface ExperienceInfo {
  hasExperience: boolean;
  experiences: WorkExperience[];
  currentSalary: string;
  technicalSkills: string[];
  technicalSkillsDescription: string;
  certifications: Certification[];
  languages: Language[];
}

export interface EducationInfo {
  educations: Education[];
}

export interface ApplicationForm {
  personalInfo: PersonalInfo;
  educationInfo: EducationInfo;
  experienceInfo: ExperienceInfo;
}
