import { authRepository } from "../auth/auth.repositories";
import { applicantProfileRepository } from "./applicant_profile/applicant_profile.repositories";
import { workExperienceRepository } from "./work_experiences/work_experience.repositories";
import { educationRepository } from "./educations/education.repositories";
import { certificationRepository } from "./certifications/certification.repositories";
import { technicalSkillRepository } from "./technical_skills/technical_skill.repositories";
import { languageRepository } from "./languages/language.repositories";
import { ManagementApplicantMaster, ApplicantMaster } from "./applicant_master.types";

export const applicantMasterRepository = {
  async getByUserId(userId: string): Promise<ApplicantMaster | null> {
    const user = await authRepository.findById(userId);

    if (!user) {
      return null;
    }

    const applicantProfile = await applicantProfileRepository.getByUserId(userId);

    if (!applicantProfile) {
      return {
        user,
        applicantProfile: null,
        workExperiences: [],
        educations: [],
        certifications: [],
        technicalSkills: [],
        languages: [],
      };
    }

    const [workExperiences, educations, certifications, technicalSkills, languages] = await Promise.all([
      workExperienceRepository.getByProfileId(applicantProfile.id),
      educationRepository.getByProfileId(applicantProfile.id),
      certificationRepository.getByProfileId(applicantProfile.id),
      technicalSkillRepository.getByProfileId(applicantProfile.id),
      languageRepository.getByProfileId(applicantProfile.id),
    ]);

    return {
      user,
      applicantProfile,
      workExperiences,
      educations,
      certifications,
      technicalSkills,
      languages,
    };
  },
  async getByApplicantProfileId(applicantProfileId: string): Promise<ManagementApplicantMaster | null> {
    const applicantProfile = await applicantProfileRepository.getById(applicantProfileId);

    if (!applicantProfile) {
      return null;
    }

    const [workExperiences, educations, certifications, technicalSkills, languages] = await Promise.all([
      workExperienceRepository.getByProfileId(applicantProfile.id),
      educationRepository.getByProfileId(applicantProfile.id),
      certificationRepository.getByProfileId(applicantProfile.id),
      technicalSkillRepository.getByProfileId(applicantProfile.id),
      languageRepository.getByProfileId(applicantProfile.id),
    ]);

    return {
      applicantProfile,
      workExperiences,
      educations,
      certifications,
      technicalSkills,
      languages,
    };
  },
};
