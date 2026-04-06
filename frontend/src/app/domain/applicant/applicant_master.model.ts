import { ApplicantProfile } from './applicant_profile/applicant_profile.model';
import { Education } from './education/education.model';
import { Certification } from './certification/certification.model';
import { Language } from './language/language.model';
import { TechnicalSkill } from './technical_skill/technical_skill.model';
import { WorkExperience } from './work_experience/work_experience.model';

export interface UserMe {
  id: string;
  email: string;
  isActive: boolean;
  roleName: string | null;
}

export interface ApplicantMaster {
  user: UserMe;
  applicantProfile: ApplicantProfile | null;
  workExperiences: WorkExperience[];
  educations: Education[];
  certifications: Certification[];
  technicalSkills: TechnicalSkill[];
  languages: Language[];
}
