import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

import {
  ApplicantFilters,
  SortDirection,
  SortField,
  filterApplicants,
  formatPhone,
  sortApplicants,
} from './utils/applicant-filter.utils';

import { getUniqueOptions, paginate } from '../../../shared/utils';

const DEFAULT_SORT_FIELD: SortField = 'fullName';
const DEFAULT_SORT_DIRECTION: SortDirection = 'asc';
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

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
export class Applicant implements OnInit {
  private readonly applicantProfileService = inject(ApplicantProfileService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly applications = signal<ApplicantProfile[]>([]);

  readonly searchTerm = signal('');
  readonly selectedGender = signal('');
  readonly selectedPhoneCode = signal('');
  readonly sortField = signal<SortField>(DEFAULT_SORT_FIELD);
  readonly sortDirection = signal<SortDirection>(DEFAULT_SORT_DIRECTION);
  readonly currentPage = signal(1);
  readonly pageSize = signal(DEFAULT_PAGE_SIZE);

  readonly filteredApplicants = computed(() => {
    const filters: ApplicantFilters = {
      keyword: this.searchTerm(),
      gender: this.selectedGender(),
      phoneCode: this.selectedPhoneCode(),
    };

    const filtered = filterApplicants(this.applications(), filters);
    return sortApplicants(filtered, this.sortField(), this.sortDirection());
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredApplicants().length / this.pageSize())),
  );

  readonly safePage = computed(() => Math.min(this.currentPage(), this.totalPages()));

  readonly pagedApplicants = computed(() =>
    paginate(this.filteredApplicants(), this.safePage(), this.pageSize()),
  );

  readonly genderOptions = computed(() =>
    getUniqueOptions(this.applications().map((item) => item.gender)),
  );

  readonly phoneCodeOptions = computed(() =>
    getUniqueOptions(this.applications().map((item) => item.phoneCode)),
  );

  readonly toolbarFilters = computed<ToolbarFilter[]>(() => [
    {
      key: 'gender',
      label: 'All Gender',
      value: this.selectedGender(),
      options: this.genderOptions(),
    },
    {
      key: 'phoneCode',
      label: 'All Phone Code',
      value: this.selectedPhoneCode(),
      options: this.phoneCodeOptions(),
    },
  ]);

  readonly tablePagination = computed<DataTablePagination>(() => {
    const total = this.filteredApplicants().length;
    const page = this.safePage();
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
    { key: 'fullName', label: 'Sort by Full Name' },
    { key: 'email', label: 'Sort by Email' },
    { key: 'gender', label: 'Sort by Gender' },
    { key: 'phone', label: 'Sort by Phone' },
    { key: 'linkedinUrl', label: 'Sort by LinkedIn URL' },
  ];

  readonly toolbarActions: ToolbarAction[] = [{ key: 'reset', label: 'Reset Filters' }];

  ngOnInit(): void {
    this.loadApplicants();
  }

  onToolbarSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  onToolbarFilterChange(event: { key: string; value: string }): void {
    if (event.key === 'gender') this.selectedGender.set(event.value);
    if (event.key === 'phoneCode') this.selectedPhoneCode.set(event.value);
    this.currentPage.set(1);
  }

  onToolbarSortDirectionChange(direction: SortDirection): void {
    this.sortDirection.set(direction);
  }

  onToolbarSortByChange(field: string): void {
    const incoming = field as SortField;

    if (this.sortField() === incoming) {
      this.sortDirection.update((dir) => (dir === 'asc' ? 'desc' : 'asc'));
      return;
    }

    this.sortField.set(incoming);
    this.sortDirection.set('asc');
  }

  onToolbarAction(action: string): void {
    if (action === 'reset') this.resetFilters();
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }

  viewApplicant(applicant: ApplicantProfile): void {
    this.router.navigate(['/management/applicant', applicant.id]);
  }

  private loadApplicants(): void {
    this.isLoading.set(true);

    this.applicantProfileService.getAll().subscribe({
      next: (data) => {
        this.applications.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load applicants:', error);
        this.applications.set([]);
        this.isLoading.set(false);
      },
    });
  }

  private resetFilters(): void {
    this.searchTerm.set('');
    this.selectedGender.set('');
    this.selectedPhoneCode.set('');
    this.sortField.set(DEFAULT_SORT_FIELD);
    this.sortDirection.set(DEFAULT_SORT_DIRECTION);
    this.currentPage.set(1);
  }
}
