import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { ApplicantProfile } from '../../../../../../domain/applicant/';
import { ApplyHistoryList } from '../../../../../../domain/apply/apply.model';

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
  readonly applications = input<ApplyHistoryList[]>([]);

  readonly tabChange = output<ApplicantDetailTab>();

  readonly applicationStats = computed(() => {
    const apps = this.applications();
    const stats: { label: string; count: number; colorClass: string; icon: string }[] = [];
    const countMap = new Map<string, number>();

    for (const app of apps) {
      const name = app.statusName || 'Unknown';
      countMap.set(name, (countMap.get(name) || 0) + 1);
    }

    const colorMap: Record<string, { colorClass: string; icon: string }> = {
      default: { colorClass: 'text-info', icon: '▣' },
    };

    for (const [name, count] of countMap) {
      const nameLower = name.toLowerCase();
      let colorClass = 'text-info';
      let icon = '▣';

      if (nameLower.includes('tolak') || nameLower.includes('reject')) {
        colorClass = 'text-error';
        icon = '⊗';
      } else if (nameLower.includes('hire') || nameLower.includes('diterima')) {
        colorClass = 'text-success';
        icon = '✓';
      } else if (nameLower.includes('proses') || nameLower.includes('review') || nameLower.includes('interview') || nameLower.includes('test')) {
        colorClass = 'text-warning';
        icon = '▣';
      }

      stats.push({ label: name, count, colorClass, icon });
    }

    return stats;
  });

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
