import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobService } from '../../../core/services/job';
import { Job } from '../../../core/mock/job.mock';
import { JobCard } from '../../../shared/components/job-card/job-card';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [RouterLink, JobCard],
  templateUrl: './job-detail.html',
})
export class JobDetail implements OnInit {
  job: Job | null = null;
  otherJobs: Job[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.jobService.getJobById(id).subscribe((job) => {
        this.job = job;
      });
      this.jobService.getJobs().subscribe((jobs) => {
        this.otherJobs = jobs.filter((j) => j.id !== id).slice(0, 3);
      });
    });
  }
  goToApply() {
    console.log('job id:', this.job?.id);
    this.router.navigate(['/job', this.job?.id, 'apply']);
  }
}
