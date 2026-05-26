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
    forgotPasswordRequest: `${API_URL}/api/auth/forgot-password/request`,
    forgotPasswordConfirm: `${API_URL}/api/auth/forgot-password/confirm`,
    changeEmailRequest: `${API_URL}/api/auth/change-email/request`,
    changeEmailConfirm: `${API_URL}/api/auth/change-email/confirm`,
    changePassword: `${API_URL}/api/auth/change-password`,
    verifyForgotPasswordOtp: `${API_URL}/api/auth/forgot-password/verify-otp`,
  },
  applicant: {
    applicantMaster: `${API_URL}/api/applicant/applicant-master/me`,
    getByid: (id: string) => `${API_URL}/api/applicant/applicant-master/${id}`,
    applicantProfile: `${API_URL}/api/applicant/profile/me`,
    workExperiences: `${API_URL}/api/applicant/work-experiences`,
    educations: `${API_URL}/api/applicant/educations`,
    certifications: `${API_URL}/api/applicant/certifications`,
    languages: `${API_URL}/api/applicant/languages`,
    technicalSkills: `${API_URL}/api/applicant/technical-skills`,
  },
  job: {
    list: `${API_URL}/api/job/jobs`,
    listOpen: `${API_URL}/api/job/jobs/open`,
    detail: (id: string) => `${API_URL}/api/job/jobs/${id}`,
    jobs: `${API_URL}/api/job/jobs`,
    slug: (slug: string) => `${API_URL}/api/job/jobs/slug/${slug}`,
    savedJobs: `${API_URL}/api/job/saved-jobs`,
  },
  apply: {
    root: `${API_URL}/api/apply`,
    applyStatusHistories: `${API_URL}/api/apply/statusHistories`,
    profile: `${API_URL}/api/apply-profile`,
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
    jobApplyStatuses: `${API_URL}/api/job/apply-job-statuses`,
  },
  admin: {
    users: `${API_URL}/api/user`,
    roles: `${API_URL}/api/role`,
    permissionActions: `${API_URL}/api/permission-actions`,
    modules: `${API_URL}/api/modules`,
    permissions: `${API_URL}/api/permissions`,
    rolePermissions: `${API_URL}/api/role-permissions`,
    dashboard: `${API_URL}/api/dashboard`,
    managementProfile: `${API_URL}/api/management-profile`,
  },
};
