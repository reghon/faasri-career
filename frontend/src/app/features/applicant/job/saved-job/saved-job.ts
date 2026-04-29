import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { SavedJobListItem } from '../../../../domain/job/saved-job/saved-job.model';
import { SavedJobService } from '../../../../domain/job/saved-job/saved-job.service';
import { JobCard } from '../../../../shared/components/job-card/job-card';

@Component({
  selector: 'app-saved-job',
  standalone: true,
  imports: [CommonModule, JobCard, RouterLink],
  templateUrl: './saved-job.html',
})
export class SavedJob implements OnInit {
  private readonly savedJobService = inject(SavedJobService);
  private readonly cdr = inject(ChangeDetectorRef);

  savedJobs: SavedJobListItem[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadSavedJobs();
  }

  loadSavedJobs(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.savedJobService.getAll().subscribe({
      next: (data) => {
        this.savedJobs = data;
        this.isLoading = false;

        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Gagal memuat lamaran yang disimpan.';
        this.isLoading = false;

        this.cdr.markForCheck();
      },
    });
  }
}
