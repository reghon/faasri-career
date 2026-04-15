import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import {
  WorkExperience,
  WorkExperiencePayload,
  WorkExperienceService,
} from '../../../../../domain/applicant';
import { GenericModalComponent } from '../../../../../shared/components/general/generic-modal.component';
import {
  WorkExperienceFormItem,
  WorkExperienceSectionComponent,
  WorkExperienceSectionValue,
  WORK_EXPERIENCE_EMPLOYMENT_TYPES,
  WORK_EXPERIENCE_INDUSTRIES,
  WORK_EXPERIENCE_JOB_LEVELS,
  WORK_EXPERIENCE_LEAVE_REASONS,
  WORK_EXPERIENCE_PHONE_CODES,
  createWorkExperienceSectionValue,
  isSameWorkExperiencePayload,
  normalizeWorkExperienceSectionValue,
  toWorkExperiencePayload,
} from '../../../apply/components/step3-experience/work-experience/work-experience-section';

interface WorkExperienceModalFormValue {
  hasExperience: boolean;
  experiences: WorkExperienceFormItem[];
}

@Component({
  selector: 'app-work-experience-modal',
  standalone: true,
  imports: [CommonModule, GenericModalComponent, WorkExperienceSectionComponent],
  templateUrl: './work-experience-modal.component.html',
})
export class WorkExperienceModalComponent implements OnChanges {
  @ViewChild(WorkExperienceSectionComponent)
  workExperienceSection?: WorkExperienceSectionComponent;

  @Input() open = false;
  @Input() data: WorkExperience[] | null = null;

  @Input() phoneCodes: string[] = WORK_EXPERIENCE_PHONE_CODES;
  @Input() industries: string[] = WORK_EXPERIENCE_INDUSTRIES;
  @Input() employmentTypes: string[] = WORK_EXPERIENCE_EMPLOYMENT_TYPES;
  @Input() jobLevels: string[] = WORK_EXPERIENCE_JOB_LEVELS;
  @Input() leaveReasons: string[] = WORK_EXPERIENCE_LEAVE_REASONS;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  isSubmitting = false;

  formData: WorkExperienceModalFormValue = this.createEmptyForm();
  originalExperiences: WorkExperience[] = [];

  constructor(private readonly workExperienceService: WorkExperienceService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] || changes['data']) {
      this.originalExperiences = this.data ? [...this.data] : [];
      this.formData = this.mapInputToForm(this.data);
    }
  }

  onClose(): void {
    if (this.isSubmitting) return;
    this.close.emit();
  }

  onDataChange(data: WorkExperienceSectionValue): void {
    this.formData = {
      hasExperience: data.hasExperience,
      experiences: data.experiences.map((exp, index) => ({
        ...exp,
        id: this.formData.experiences[index]?.id,
      })),
    };
  }

  onSave(): void {
    const errors = this.workExperienceSection?.validate() || [];
    if (errors.length > 0) return;

    this.isSubmitting = true;

    const normalized = this.normalizeFormValue(this.formData);
    const originalMap = this.toMapById(this.originalExperiences);

    const originalIds = new Set(this.originalExperiences.map((item) => item.id));
    const currentIds = new Set(
      normalized.hasExperience
        ? normalized.experiences.filter((item) => !!item.id).map((item) => item.id as string)
        : [],
    );

    const createRequests: Observable<unknown>[] = normalized.hasExperience
      ? normalized.experiences
          .filter((item) => !item.id)
          .map((item) => this.workExperienceService.create(toWorkExperiencePayload(item)))
      : [];

    const updateRequests: Observable<unknown>[] = normalized.hasExperience
      ? normalized.experiences
          .filter((item) => !!item.id)
          .filter((item) => {
            const original = originalMap.get(item.id as string);
            if (!original) return false;

            return !isSameWorkExperiencePayload(
              toWorkExperiencePayload(item),
              this.toOriginalPayload(original),
            );
          })
          .map((item) =>
            this.workExperienceService.update(item.id as string, toWorkExperiencePayload(item)),
          )
      : [];

    const deleteRequests: Observable<unknown>[] = this.originalExperiences
      .filter((item) => originalIds.has(item.id) && !currentIds.has(item.id))
      .map((item) => this.workExperienceService.delete(item.id));

    const requests = [...createRequests, ...updateRequests, ...deleteRequests];
    const submit$ = requests.length > 0 ? forkJoin(requests) : of([]);

    submit$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.saved.emit();
        this.close.emit();
      },
      error: (error) => {
        console.error('[WorkExperienceModal] ERROR:', error);
        this.isSubmitting = false;
      },
    });
  }

  private createEmptyForm(): WorkExperienceModalFormValue {
    return {
      hasExperience: true,
      experiences: createWorkExperienceSectionValue().experiences.map((exp) => ({
        ...exp,
      })),
    };
  }

  private mapInputToForm(data: WorkExperience[] | null): WorkExperienceModalFormValue {
    if (!data || data.length === 0) {
      return this.createEmptyForm();
    }

    return {
      hasExperience: true,
      experiences: data.map((item) => ({
        id: item.id,
        company: item.company || '',
        industry: item.industry || '',
        position: item.position || '',
        employmentType: item.employmentType || '',
        jobLevel: item.jobLevel || '',
        teamSize: item.teamSize || '',
        startDay: item.startDay || '',
        startMonth: item.startMonth || '',
        startYear: item.startYear || '',
        endDay: item.endDay || '',
        endMonth: item.endMonth || '',
        endYear: item.endYear || '',
        isCurrentJob: !!item.isCurrentJob,
        responsibilities: item.responsibilities || '',
        leaveReason: item.leaveReason || '',
        referenceName: item.referenceName || '',
        referencePosition: item.referencePosition || '',
        referencePhoneCode: item.referencePhoneCode || '+62',
        referencePhone: item.referencePhone || '',
        referenceEmail: item.referenceEmail || '',
      })),
    };
  }

  private normalizeFormValue(data: WorkExperienceModalFormValue): WorkExperienceModalFormValue {
    const normalizedSection = normalizeWorkExperienceSectionValue({
      hasExperience: data.hasExperience,
      experiences: data.experiences,
    });

    return {
      hasExperience: normalizedSection.hasExperience,
      experiences: normalizedSection.hasExperience
        ? normalizedSection.experiences.map((exp, index) => ({
            ...exp,
            id: data.experiences[index]?.id,
          }))
        : [],
    };
  }

  private toOriginalPayload(item: WorkExperience): WorkExperiencePayload {
    return {
      company: item.company || null,
      industry: item.industry || null,
      position: item.position || null,
      employmentType: item.employmentType || null,
      jobLevel: item.jobLevel || null,
      teamSize: item.teamSize || null,
      startDay: item.startDay || null,
      startMonth: item.startMonth || null,
      startYear: item.startYear || null,
      endDay: item.endDay || null,
      endMonth: item.endMonth || null,
      endYear: item.endYear || null,
      isCurrentJob: !!item.isCurrentJob,
      responsibilities: item.responsibilities || null,
      leaveReason: item.leaveReason || null,
      referenceName: item.referenceName || null,
      referencePosition: item.referencePosition || null,
      referencePhoneCode: item.referencePhoneCode || '+62',
      referencePhone: item.referencePhone || null,
      referenceEmail: item.referenceEmail || null,
    };
  }

  private toMapById<T extends { id?: string }>(items: T[]): Map<string, T> {
    return new Map(items.filter((item) => !!item.id).map((item) => [item.id as string, item]));
  }
}
