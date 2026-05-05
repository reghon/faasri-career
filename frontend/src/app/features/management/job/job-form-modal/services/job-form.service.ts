import { Injectable, inject } from '@angular/core';
import { forkJoin, map, switchMap } from 'rxjs';

import { JobService } from '../../../../../domain/job/services/job.service';
import {
  DepartmentService,
  EducationLevelService,
  EmploymentTypeService,
  JobCategoryService,
  JobLocationService,
  JobStatusService,
  WorkModeService,
} from '../../../../../domain/master-data';
import { ApplyStatusService } from '../../../../../domain/apply/master-data/apply-status/apply-status.service';
import { JobApplyStatusService } from '../../../../../domain/apply/master-data/job-apply-status/job-apply-status.services';
import { JobPayload } from '../../../../../domain/job/models/job.model';
import { JobFlowStatusItem, JobFormMasters } from '../models/job-form.model';

@Injectable({
  providedIn: 'root',
})
export class JobFormFacadeService {
  private readonly jobService = inject(JobService);

  private readonly departmentService = inject(DepartmentService);
  private readonly educationLevelService = inject(EducationLevelService);
  private readonly employmentTypeService = inject(EmploymentTypeService);
  private readonly jobCategoryService = inject(JobCategoryService);
  private readonly jobLocationService = inject(JobLocationService);
  private readonly jobStatusService = inject(JobStatusService);
  private readonly workModeService = inject(WorkModeService);
  private readonly applyStatusService = inject(ApplyStatusService);
  private readonly jobApplyStatusService = inject(JobApplyStatusService);

  loadMasters() {
    return forkJoin({
      categories: this.jobCategoryService.getAll(),
      employmentTypes: this.employmentTypeService.getAll(),
      statuses: this.jobStatusService.getAll(),
      jobLocations: this.jobLocationService.getAll(),
      educationLevels: this.educationLevelService.getAll(),
      departments: this.departmentService.getAll(),
      workModes: this.workModeService.getAll(),
      applyStatuses: this.applyStatusService.getAll(),
    }).pipe(
      map(
        (masters): JobFormMasters => ({
          categories: masters.categories.map((item) => ({ id: item.id, name: item.name })),
          employmentTypes: masters.employmentTypes.map((item) => ({
            id: item.id,
            name: item.name,
          })),
          statuses: masters.statuses.map((item) => ({ id: item.id, name: item.name })),
          jobLocations: masters.jobLocations.map((item) => ({ id: item.id, name: item.name })),
          educationLevels: masters.educationLevels.map((item) => ({
            id: item.id,
            name: item.name,
          })),
          departments: masters.departments.map((item) => ({ id: item.id, name: item.name })),
          workModes: masters.workModes.map((item) => ({ id: item.id, name: item.name })),
          applyStatuses: masters.applyStatuses.filter((item) => item.isActive),
        }),
      ),
    );
  }

  loadJobFormDetail(jobId: string) {
    return forkJoin({
      job: this.jobService.getJobById(jobId),
      jobApplyStatuses: this.jobApplyStatusService.getByJobId(jobId),
      editGuard: this.jobApplyStatusService.getEditGuard(jobId),
    });
  }

  validateJobFlowEdit(jobId: string) {
    return this.jobApplyStatusService.getEditGuard(jobId);
  }

  saveJob(jobId: string | null, payload: JobPayload) {
    return jobId ? this.jobService.updateJob(jobId, payload) : this.jobService.createJob(payload);
  }

  syncJobFlow(jobId: string, jobFlowStatuses: JobFlowStatusItem[]) {
    const payload = {
      items: jobFlowStatuses.map((item, index) => ({
        applyStatusId: item.applyStatusId,
        sortOrder: index + 1,
        isDefault: item.isDefault,
        isFinal: item.isFinal,
        isActive: item.isActive,
      })),
    };

    return this.jobApplyStatusService.syncByJobId(jobId, payload);
  }

  saveJobWithFlow(
    jobId: string | null,
    payload: JobPayload,
    jobFlowStatuses: JobFlowStatusItem[],
    shouldSyncFlow: boolean,
  ) {
    return this.saveJob(jobId, payload).pipe(
      switchMap((job) => {
        const savedJobId = jobId || job.id;

        if (!shouldSyncFlow) {
          return [job];
        }

        return this.syncJobFlow(savedJobId, jobFlowStatuses).pipe(map(() => job));
      }),
    );
  }
}
