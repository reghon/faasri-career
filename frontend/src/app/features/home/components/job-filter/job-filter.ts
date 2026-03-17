import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface JobFilterValue {
  search: string;
  location: string;
  jobType: string;
  workType: string;
  experience: string;
}

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
  locations = ['Kelapa Gading, Jakarta', 'Baranangsiang, Bogor', 'BSD'];
  jobTypes = ['Full Time', 'Part Time', 'Contract', 'Internship'];
  workTypes = ['WFO', 'WFH', 'Hybrid', 'Remote'];
  experiences = ['0-1 YOE', '1-2 YOE', '2-3 YOE', '3-5 YOE', '5+ YOE'];

  emit() {
    this.filterChange.emit({
      search: this.search,
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

  selectLocation(loc: string) {
    this.selectedLocation = this.selectedLocation === loc ? '' : loc;
    this.showLocationDropdown = false;
    this.emit();
  }

  selectJobType(val: string) {
    this.selectedJobType = this.selectedJobType === val ? '' : val;
    this.emit();
  }

  selectWorkType(val: string) {
    this.selectedWorkType = this.selectedWorkType === val ? '' : val;
    this.emit();
  }

  selectExperience(val: string) {
    this.selectedExperience = this.selectedExperience === val ? '' : val;
    this.emit();
  }

  get activeFilterCount(): number {
    return [
      this.selectedLocation,
      this.selectedJobType,
      this.selectedWorkType,
      this.selectedExperience,
    ].filter((v) => v !== '').length;
  }

  resetFilters() {
    this.selectedLocation = '';
    this.selectedJobType = '';
    this.selectedWorkType = '';
    this.selectedExperience = '';
    this.emit();
  }
}
