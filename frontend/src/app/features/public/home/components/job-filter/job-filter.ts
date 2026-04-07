import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface JobFilterValue {
  search: string;
  location: string;
  jobType: string;
  workType: string;
  experience: string;
}

type FilterOption = {
  label: string;
  value: string;
};

@Component({
  selector: 'app-job-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './job-filter.html',
})
export class JobFilter {
  @Input() totalJobs = 0;
  @Output() filterChange = new EventEmitter<JobFilterValue>();

  search = '';
  selectedLocation = '';
  selectedJobType = '';
  selectedWorkType = '';
  selectedExperience = '';

  showLocationDropdown = false;
  showFilterDropdown = false;

  // value disamakan dengan payload API
  locations: FilterOption[] = [
    { label: 'Kelapa Gading, DKI Jakarta', value: 'Kelapa Gading Office' },
    { label: 'Bogor Timur, Kota Bogor', value: 'Bogor Timur Office' },
    { label: 'BSD, Tangerang Selatan', value: 'BSD Office' },
  ];

  // value disamakan dengan payload API
  jobTypes: FilterOption[] = [
    { label: 'Full Time', value: 'Full Time' },
    { label: 'Part Time', value: 'Part Time' },
    { label: 'Contract', value: 'Contract' },
    { label: 'Internship', value: 'Internship' },
  ];

  // value disamakan dengan payload API
  workTypes: FilterOption[] = [
    { label: 'Onsite', value: 'Onsite' },
    { label: 'Hybrid', value: 'Hybrid' },
    { label: 'Remote', value: 'Remote' },
  ];

  experiences: FilterOption[] = [
    { label: '0-1 YOE', value: '0-1' },
    { label: '1-2 YOE', value: '1-2' },
    { label: '2-3 YOE', value: '2-3' },
    { label: '3-5 YOE', value: '3-5' },
    { label: '5+ YOE', value: '5+' },
  ];

  emit() {
    this.filterChange.emit({
      search: this.search.trim(),
      location: this.selectedLocation,
      jobType: this.selectedJobType,
      workType: this.selectedWorkType,
      experience: this.selectedExperience,
    });
  }

  onSearchInput(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.emit();
  }

  selectLocation(value: string) {
    this.selectedLocation = this.selectedLocation === value ? '' : value;
    this.showLocationDropdown = false;
    this.emit();
  }

  selectJobType(value: string) {
    this.selectedJobType = this.selectedJobType === value ? '' : value;
    this.emit();
  }

  selectWorkType(value: string) {
    this.selectedWorkType = this.selectedWorkType === value ? '' : value;
    this.emit();
  }

  selectExperience(value: string) {
    this.selectedExperience = this.selectedExperience === value ? '' : value;
    this.emit();
  }

  get activeFilterCount(): number {
    return [
      this.selectedLocation,
      this.selectedJobType,
      this.selectedWorkType,
      this.selectedExperience,
    ].filter(Boolean).length;
  }

  get selectedLocationLabel(): string {
    return this.locations.find((item) => item.value === this.selectedLocation)?.label ?? 'Lokasi';
  }

  resetFilters() {
    this.selectedLocation = '';
    this.selectedJobType = '';
    this.selectedWorkType = '';
    this.selectedExperience = '';
    this.emit();
  }
}
