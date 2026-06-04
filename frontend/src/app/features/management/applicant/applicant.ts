import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from '../../../shared/components/breadcrumb/breadcrumb';

import {
  DataTableColumn,
  DataTableComponent,
  DataTablePagination,
} from '../../../shared/components/data-table/data-table';

import {
  TableToolbarComponent,
  ToolbarAction,
  ToolbarFilter,
  ToolbarSortOption,
} from '../../../shared/components/table-toolbar/table-toolbar';

import { ApplicantProfile } from '../../../domain/applicant/applicant_profile/applicant_profile.model';
import { ApplicantProfileService } from '../../../domain/applicant/applicant_profile/applicant_profile.service';
import { formatPhone } from './utils/applicant-filter.utils';
import { RbacService } from '../../../domain/authorization/rbac.service';

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const SEARCH_DEBOUNCE_MS = 300;

@Component({
  selector: 'app-applicant',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbComponent,
    DataTableComponent,
    TableToolbarComponent,
  ],
  templateUrl: './applicant.html',
})
export class Applicant implements OnInit, OnDestroy {
  private readonly applicantProfileService = inject(ApplicantProfileService);
  private readonly router = inject(Router);

  readonly rbac = inject(RbacService);

  readonly isLoading = signal(false);
  readonly applicants = signal<ApplicantProfile[]>([]);
  readonly totalItems = signal(0);
  readonly totalPages = signal(0);

  readonly searchTerm = signal('');
  readonly selectedGender = signal('');
  readonly sortBy = signal('');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');
  readonly currentPage = signal(1);
  readonly pageSize = signal(DEFAULT_PAGE_SIZE);

  private readonly searchSubject = new Subject<string>();
  private searchSub!: Subscription;

  readonly toolbarFilters = computed<ToolbarFilter[]>(() => [
    {
      key: 'gender',
      label: 'Gender',
      value: this.selectedGender(),
      options: ['Laki-laki', 'Perempuan'],
    },
  ]);

  readonly tablePagination = computed<DataTablePagination>(() => {
    const total = this.totalItems();
    const page = this.currentPage();
    const size = this.pageSize();

    return {
      currentPage: page,
      totalPages: this.totalPages(),
      startEntry: total === 0 ? 0 : (page - 1) * size + 1,
      endEntry: Math.min(page * size, total),
      totalItems: total,
      pageSize: size,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
    };
  });

  readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Management', route: '/management' },
    { label: 'Applicant' },
  ];

  readonly applicantColumns: DataTableColumn<ApplicantProfile>[] = [
    {
      key: 'fullName',
      label: 'Full Name',
      minWidth: '220px',
      valueGetter: (item) => item.fullName || '-',
    },
    {
      key: 'email',
      label: 'Email',
      minWidth: '220px',
      valueGetter: (item) => item.email || '-',
    },
    {
      key: 'gender',
      label: 'Gender',
      align: 'center',
      valueGetter: (item) => item.gender || '-',
    },
    {
      key: 'phone',
      label: 'Phone',
      valueGetter: (item) => formatPhone(item),
    },
    {
      key: 'linkedinUrl',
      label: 'LinkedIn URL',
      minWidth: '240px',
      valueGetter: (item) => item.linkedinUrl || '-',
    },
    { key: 'action', label: 'Action', type: 'action', align: 'right' },
  ];

  readonly toolbarSortOptions: ToolbarSortOption[] = [
    { key: 'full_name', label: 'Full Name' },
  ];

  readonly toolbarActions: ToolbarAction[] = [{ key: 'reset', label: 'Reset Filters' }];

  ngOnInit(): void {
    this.loadApplicants();

    this.searchSub = this.searchSubject.pipe(debounceTime(SEARCH_DEBOUNCE_MS)).subscribe((value) => {
      this.searchTerm.set(value);
      this.currentPage.set(1);
      this.loadApplicants();
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  onToolbarSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  onToolbarFilterChange(event: { key: string; value: string }): void {
    if (event.key === 'gender') this.selectedGender.set(event.value);
    this.currentPage.set(1);
    this.loadApplicants();
  }

  onToolbarSortByChange(field: string): void {
    if (this.sortBy() === field) {
      this.sortDirection.update((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortBy.set(field);
      this.sortDirection.set('asc');
    }
    this.currentPage.set(1);
    this.loadApplicants();
  }

  onToolbarSortDirectionChange(direction: 'asc' | 'desc'): void {
    this.sortDirection.set(direction);
    this.currentPage.set(1);
    this.loadApplicants();
  }

  onToolbarAction(action: string): void {
    if (action === 'reset') this.resetFilters();
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadApplicants();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadApplicants();
  }

  viewApplicant(applicant: ApplicantProfile): void {
    this.router.navigate(['/management/applicant', applicant.id]);
  }

  private loadApplicants(): void {
    this.isLoading.set(true);

    this.applicantProfileService
      .getAll({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm(),
        gender: this.selectedGender(),
        sortBy: this.sortBy(),
        sortDirection: this.sortDirection(),
      })
      .subscribe({
        next: (response) => {
          this.applicants.set(response.items);
          this.totalItems.set(response.meta.total);
          this.totalPages.set(response.meta.totalPages);
          this.isLoading.set(false);
        },
        error: () => {
          this.applicants.set([]);
          this.totalItems.set(0);
          this.totalPages.set(0);
          this.isLoading.set(false);
        },
      });
  }

  private resetFilters(): void {
    this.searchTerm.set('');
    this.selectedGender.set('');
    this.sortBy.set('');
    this.sortDirection.set('asc');
    this.currentPage.set(1);
    this.loadApplicants();
  }
}
