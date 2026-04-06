import { environment } from '../../../environments/environment';

export const API_URL = environment.apiUrl;

export const API_ENDPOINTS = {
  auth: {
    login: `${API_URL}/api/auth/login`,
    register: `${API_URL}/api/auth/register`,
    logout: `${API_URL}/api/auth/logout`,
    refresh: `${API_URL}/api/auth/refresh`,
    me: `${API_URL}/api/auth/me`,
    verifyOtp: `${API_URL}/api/auth/verify-otp`,
  },
  applicant: {
    applicantMaster: `${API_URL}/api/applicant/applicant-master/me`,
    applicantProfile: `${API_URL}/api/applicant/profile/me`,
    workExperiences: `${API_URL}/api/applicant/work-experiences`,
    educations: `${API_URL}/api/applicant/educations`,
    certifications: `${API_URL}/api/applicant/certifications`,
    languages: `${API_URL}/api/applicant/languages`,
    technicalSkills: `${API_URL}/api/applicant/technical-skills`,
  },
};
