import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { MOCK_JOBS, Job } from '../mock/job.mock';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  getJobs() {
    return of(MOCK_JOBS);
  }

  getJobById(id: string) {
    const job = MOCK_JOBS.find((j) => j.id === id);
    return of(job ?? null);
  }
}
