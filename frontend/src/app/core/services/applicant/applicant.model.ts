export interface WorkExperience {
  id: string;
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
}

export interface Education {
  id: string;
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

export interface Certification {
  id: string;
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
  id: string;
  language: string;
  proficiency: string;
}

export interface TechnicalSkill {
  id: string;
  skillName: string;
}

export interface ApplicantProfile {
  id: string;
  fullName: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  phoneCode: string;
  phone: string;
  address: string;
  kelurahan: string;
  kecamatan: string;
  city: string;
  province: string;
  postalCode: string;
  isSameAddress: boolean;
  linkedinUrl: string;
  avatarUrl: string;
  cvUrl: string;
  cvFileName: string;
  workExperiences: WorkExperience[];
  educations: Education[];
  certifications: Certification[];
  languages: Language[];
  technicalSkills: TechnicalSkill[];
}

export interface ProfileViewModel {
  name: string;
  email: string;
  avatar: string | null;
  birthPlace: string;
  birthDate: string;
  gender: string;
  phoneCode: string;
  phone: string;
  linkedinUrl: string;
  cvFile: string | null;
  workExperiences: WorkExperience[];
  educations: Education[];
  certifications: Certification[];
  technicalSkills: string[];
}
