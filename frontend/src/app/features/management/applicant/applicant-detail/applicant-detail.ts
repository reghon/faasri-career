import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from '../../../../shared/components/breadcrumb/breadcrumb';

import { ApplicantMaster } from '../../../../domain/applicant/applicant_master.model';
import { ApplicantMasterService } from '../../../../domain/applicant/applicant_master.service';
import { ApplyService } from '../../../../domain/apply/apply.service';
import { ApplyHistoryList } from '../../../../domain/apply/apply.model';
import { API_URL } from '../../../../core/config/api.config';

import { ApplicantDetailHeaderComponent } from './components/applicant-detail-header/applicant-detail-header';
import { ApplicantDetailProfileComponent } from './components/applicant-detail-profile/applicant-detail-profile';
import { ApplicantDetailApplicationComponent } from './components/applicant-detail-application/applicant-detail-application';

type ApplicantDetailTab = 'profile' | 'applications' ;

@Component({
  selector: 'app-applicant-detail',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    ApplicantDetailHeaderComponent,
    ApplicantDetailProfileComponent,
    ApplicantDetailApplicationComponent,
  ],
  templateUrl: './applicant-detail.html',
})
export class ApplicantDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly applicantMasterService = inject(ApplicantMasterService);
  private readonly applyService = inject(ApplyService);

  readonly isLoading = signal(false);
  readonly applicantMaster = signal<ApplicantMaster | null>(null);
  readonly applications = signal<ApplyHistoryList[]>([]);
  readonly activeTab = signal<ApplicantDetailTab>('profile');

  readonly applicantProfile = computed(() => {
    const p = this.applicantMaster()?.applicantProfile ?? null;
    if (!p) return null;
    return {
      ...p,
      avatarUrl: p.avatarUrl ? `${API_URL}${p.avatarUrl}` : null,
      cvUrl: p.cvUrl ? `${API_URL}${p.cvUrl}` : null,
    };
  });

  readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Management', route: '/management' },
    { label: 'Applicant', route: '/management/applicant' },
    { label: 'Applicant Detail' },
  ];

  ngOnInit(): void {
    const applicantProfileId = this.route.snapshot.paramMap.get('id');

    if (!applicantProfileId) {
      this.router.navigate(['/management/applicant']);
      return;
    }

    this.loadApplicantDetail(applicantProfileId);
  }

  setActiveTab(tab: ApplicantDetailTab): void {
    this.activeTab.set(tab);
  }

  goBack(): void {
    this.router.navigate(['/management/applicant']);
  }

  private loadApplicantDetail(applicantProfileId: string): void {
    this.isLoading.set(true);

    this.applicantMasterService.getByApplicantProfileId(applicantProfileId).subscribe({
      next: (data) => {
        this.applicantMaster.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load applicant detail:', error);
        this.applicantMaster.set(null);
        this.isLoading.set(false);
      },
    });

    this.applyService.getApplyListByApplicantProfileId(applicantProfileId).subscribe({
      next: (apps) => this.applications.set(apps),
      error: () => this.applications.set([]),
    });
  }
}
