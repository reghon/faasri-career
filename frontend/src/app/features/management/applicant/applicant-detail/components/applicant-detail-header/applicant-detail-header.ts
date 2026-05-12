import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { ApplicantProfile } from '../../../../../../domain/applicant/';

type ApplicantDetailTab = 'profile' | 'applications';

@Component({
  selector: 'app-applicant-detail-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applicant-detail-header.html',
})
export class ApplicantDetailHeaderComponent {
  readonly profile = input<ApplicantProfile | null>(null);
  readonly activeTab = input<ApplicantDetailTab>('profile');

  readonly tabChange = output<ApplicantDetailTab>();

  readonly fullName = computed(() => this.profile()?.fullName || '-');
  readonly email = computed(() => this.profile()?.email || '-');
  readonly phone = computed(() => {
    const profile = this.profile();
    if (!profile) return '-';
    return `${profile.phoneCode || ''} ${profile.phone || '-'}`.trim();
  });

  readonly birthInfo = computed(() => {
    const profile = this.profile();
    if (!profile) return '-';

    const place = profile.birthPlace || '-';
    const date = profile.birthDate || '-';

    return `${place}, ${date}`;
  });

  readonly gender = computed(() => this.profile()?.gender || '-');
  readonly linkedinUrl = computed(() => this.profile()?.linkedinUrl || '-');
  readonly avatarUrl = computed(() => this.profile()?.avatarUrl || null);

  isActive(tab: ApplicantDetailTab): boolean {
    return this.activeTab() === tab;
  }

  selectTab(tab: ApplicantDetailTab): void {
    this.tabChange.emit(tab);
  }
}
