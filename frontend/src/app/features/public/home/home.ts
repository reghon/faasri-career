import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HeroSection } from './components/hero-section/hero-section';
import { JobFilter, JobFilterValue } from './components/job-filter/job-filter';
import { JobCard } from '../../../shared/components/job-card/job-card';
import { JobService } from '../../../domain/job/services/job.service';
import { JobListItem } from '../../../domain/job/models/job.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroSection, JobFilter, JobCard],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  jobs: JobListItem[] = [];
  allJobs: JobListItem[] = [];
  filteredJobs: JobListItem[] = [];
  currentPage = 1;
  pageSize = 9;
  isLoading = false;

  private filterSubject = new Subject<JobFilterValue>();

  constructor(
    private jobService: JobService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadJobs();

    this.filterSubject.pipe(debounceTime(200)).subscribe((filter) => {
      this.filteredJobs = this.allJobs.filter((job) => {
        const search = filter.search.toLowerCase();

        const matchSearch =
          !search ||
          job.title.toLowerCase().includes(search) ||
          job.category.toLowerCase().includes(search);

        const matchLocation =
          !filter.location || job.location.toLowerCase().includes(filter.location.toLowerCase());

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

  loadJobs() {
    this.isLoading = true;

    this.jobService.getJobs({ page: 1, limit: 100 }).subscribe({
      next: (result) => {
        this.allJobs = result.items;
        this.filteredJobs = result.items;
        this.updatePage();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load jobs', error);
        this.allJobs = [];
        this.filteredJobs = [];
        this.jobs = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredJobs.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onFilterChange(filter: JobFilterValue) {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.filterSubject.next(filter);
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
