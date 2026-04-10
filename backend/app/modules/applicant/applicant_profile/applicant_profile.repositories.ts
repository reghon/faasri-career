import { queryCamelOne } from "../../../utils/db.util";
import { applicantProfileQueries } from "./applicant_profile.queries";
import { ApplicantProfile, ApplicantProfileAvatarPayload, ApplicantProfileCvPayload, ApplicantProfilePayload } from "./applicant_profile.types";

export const applicantProfileRepository = {
  async getByUserId(userId: string): Promise<ApplicantProfile | null> {
    return queryCamelOne<ApplicantProfile>(applicantProfileQueries.getByUserId, [userId]);
  },

  async create(userId: string, actorId: string): Promise<ApplicantProfile | null> {
    return queryCamelOne<ApplicantProfile>(applicantProfileQueries.create, [userId, actorId]);
  },

  async update(userId: string, data: ApplicantProfilePayload, actorId: string): Promise<ApplicantProfile | null> {
    return queryCamelOne<ApplicantProfile>(applicantProfileQueries.update, [
      data.fullName,
      data.email,
      data.birthPlace,
      data.birthDate,
      data.gender,
      data.phoneCode,
      data.phone,
      data.address,
      data.kelurahan,
      data.kecamatan,
      data.city,
      data.province,
      data.postalCode,
      data.linkedinUrl,
      actorId,
      userId,
    ]);
  },

  async updateAvatar(userId: string, data: ApplicantProfileAvatarPayload, actorId: string): Promise<ApplicantProfile | null> {
    return queryCamelOne<ApplicantProfile>(applicantProfileQueries.updateAvatar, [data.avatarUrl, actorId, userId]);
  },

  async updateCv(userId: string, data: ApplicantProfileCvPayload, actorId: string): Promise<ApplicantProfile | null> {
    return queryCamelOne<ApplicantProfile>(applicantProfileQueries.updateCv, [data.cvUrl, data.cvFileName, actorId, userId]);
  },
  
  async removeAvatar(userId: string, actorId: string): Promise<ApplicantProfile | null> {
    return queryCamelOne<ApplicantProfile>(applicantProfileQueries.removeAvatar, [actorId, userId]);
  },

  async removeCv(userId: string, actorId: string): Promise<ApplicantProfile | null> {
    return queryCamelOne<ApplicantProfile>(applicantProfileQueries.removeCv, [actorId, userId]);
  },
};
