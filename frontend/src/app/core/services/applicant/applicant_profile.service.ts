import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';
import { ApplicantProfile, ProfileViewModel } from './applicant.model';

@Injectable({ providedIn: 'root' })
export class ApplicantProfileService {
  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get<{ data: ApplicantProfile }>(API_ENDPOINTS.applicant.profileMe).pipe(
      map((res) => {
        const p = res.data;
        const vm: ProfileViewModel = {
          name: p.fullName || '',
          email: '',
          avatar: p.avatarUrl || null,
          birthPlace: p.birthPlace || '',
          birthDate: p.birthDate || '',
          gender: p.gender || '',
          phoneCode: p.phoneCode || '+62',
          phone: p.phone || '',
          linkedinUrl: p.linkedinUrl || '',
          cvFile: p.cvFileName || null,
          workExperiences: p.workExperiences || [],
          educations: p.educations || [],
          certifications: p.certifications || [],
          technicalSkills: (p.technicalSkills || []).map((s) => s.skillName),
        };
        return vm;
      }),
    );
  }

  updateProfile(data: Partial<ApplicantProfile>) {
    return this.http.put<{ data: ApplicantProfile }>(API_ENDPOINTS.applicant.profileMe, data);
  }
}
