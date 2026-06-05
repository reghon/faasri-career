import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { ApplicantMaster } from '../..//../../../../domain/applicant/applicant_master.model';
import { API_URL } from '../../../../../../core/config/api.config';

type ProfileAccordionKey =
  | 'profile'
  | 'workExperiences'
  | 'educations'
  | 'technicalSkills'
  | 'certifications'
  | 'languages';

@Component({
  selector: 'app-applicant-detail-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applicant-detail-profile.html',
})
export class ApplicantDetailProfileComponent {
  readonly master = input.required<ApplicantMaster>();

  readonly openedAccordions = signal<Record<ProfileAccordionKey, boolean>>({
    profile: true,
    workExperiences: true,
    educations: true,
    technicalSkills: true,
    certifications: true,
    languages: true,
  });

  readonly profile = computed(() => this.master().applicantProfile);
  readonly cvFullUrl = computed(() => {
    const url = this.profile()?.cvUrl;
    return url ? `${API_URL}${url}` : null;
  });
  readonly workExperiences = computed(() => this.master().workExperiences ?? []);
  readonly educations = computed(() => this.master().educations ?? []);
  readonly certifications = computed(() => this.master().certifications ?? []);
  readonly technicalSkills = computed(() => this.master().technicalSkills ?? []);
  readonly languages = computed(() => this.master().languages ?? []);

  toggleAccordion(key: ProfileAccordionKey): void {
    this.openedAccordions.update((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  isOpen(key: ProfileAccordionKey): boolean {
    return this.openedAccordions()[key];
  }

  accordionClass(key: ProfileAccordionKey): string {
    return this.isOpen(key) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0';
  }

  chevronClass(key: ProfileAccordionKey): string {
    return this.isOpen(key) ? 'rotate-180' : 'rotate-0';
  }

  formatPeriod(
    startDay?: string | null,
    startMonth?: string | null,
    startYear?: string | null,
    endDay?: string | null,
    endMonth?: string | null,
    endYear?: string | null,
    isCurrent?: boolean | null,
  ): string {
    const start = `${startDay || '-'}-${startMonth || '-'}-${startYear || '-'}`;
    const end = isCurrent ? 'Sekarang' : `${endDay || '-'}-${endMonth || '-'}-${endYear || '-'}`;

    return `${start} - ${end}`;
  }
}
