import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HeroSection } from './components/hero-section/hero-section';
import { JobFilter, JobFilterValue } from './components/job-filter/job-filter';
import { JobCard } from '../../../shared/components/job-card/job-card';
import { JobService } from '../../../core/services/job';
import { Job } from '../../../core/mock/job.mock';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroSection, JobFilter, JobCard],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  jobs: Job[] = [];
  allJobs: Job[] = [];
  filteredJobs: Job[] = [];
  currentPage = 1;
  pageSize = 9;
  isLoading = false;

  private filterSubject = new Subject<JobFilterValue>();

  constructor(
    private jobService: JobService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.jobService.getJobs().subscribe((data) => {
      this.allJobs = data;
      this.filteredJobs = data;
      this.updatePage();
    });

    this.filterSubject.pipe(debounceTime(200)).subscribe((filter) => {
      this.filteredJobs = this.allJobs.filter((job) => {
        const matchSearch =
          job.title.toLowerCase().includes(filter.search.toLowerCase()) ||
          job.category.toLowerCase().includes(filter.search.toLowerCase());
        const matchLocation = !filter.location || job.location.includes(filter.location);
        const matchJobType = !filter.jobType || job.jobType === filter.jobType;
        const matchWorkType = !filter.workType || job.workType === filter.workType;
        const matchExperience = !filter.experience || job.experience === filter.experience;
        return matchSearch && matchLocation && matchJobType && matchWorkType && matchExperience;
      });
      this.currentPage = 1;
      this.updatePage();
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  onFilterChange(filter: JobFilterValue) {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.filterSubject.next(filter);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredJobs.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  updatePage() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.jobs = this.filteredJobs.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
