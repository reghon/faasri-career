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
  job: {
    list: `${API_URL}/api/job/jobs`,
    detail: (id: string) => `${API_URL}/api/job/jobs/${id}`,
    jobs: `${API_URL}/api/job/jobs`,
    slug: (slug: string) => `${API_URL}/api/job/jobs/slug/${slug}`,
  },
  apply: {
    root: `${API_URL}/api/apply`,
  },
  master: {
    employmentTypes: `${API_URL}/api/job/employment-types`,
    jobCategories: `${API_URL}/api/job/job-categories`,
    jobLocations: `${API_URL}/api/job/job-locations`,
    jobStatuses: `${API_URL}/api/job/job-statuses`,
    workModes: `${API_URL}/api/job/work-modes`,
    educationLevels: `${API_URL}/api/job/education-levels`,
    departments: `${API_URL}/api/job/departments`,
    applyStatuses: `${API_URL}/api/apply/status`,
  },
  admin: {
    users: `${API_URL}/api/auth`,
    roles: `${API_URL}/api/role`
  },
};
