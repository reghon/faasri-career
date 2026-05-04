import { AuthMe } from "../auth/auth.types";
import { ApplicantProfile } from "./applicant_profile/applicant_profile.types";
import { WorkExperience } from "./work_experiences/work_experience.types";
import { Education } from "./educations/education.types";
import { Certification } from "./certifications/certification.types";
import { TechnicalSkill } from "./technical_skills/technical_skill.types";
import { Language } from "./languages/language.types";

export type ApplicantMaster = {
  user: AuthMe;
  applicantProfile: ApplicantProfile | null;
  workExperiences: WorkExperience[];
  educations: Education[];
  certifications: Certification[];
  technicalSkills: TechnicalSkill[];
  languages: Language[];
};

export type ManagementApplicantMaster = {
  applicantProfile: ApplicantProfile | null;
  workExperiences: WorkExperience[];
  educations: Education[];
  certifications: Certification[];
  technicalSkills: TechnicalSkill[];
  languages: Language[];
};
