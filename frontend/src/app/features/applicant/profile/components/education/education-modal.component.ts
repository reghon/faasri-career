import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { GenericModalComponent } from '../general/generic-modal.component';
import {
  Step2Education,
  EducationFormValue,
  createEducationFormValue,
  mapEducationModelsToForm,
  normalizeEducationFormValue,
} from '../../../apply/components/step2-education/step2-education';
import { EducationPayload } from '../../../../../domain/applicant/index';
import { EducationService } from '../../../../../domain/applicant/education/education.service';

@Component({
  selector: 'app-education-modal',
  standalone: true,
  imports: [CommonModule, GenericModalComponent, Step2Education],
  templateUrl: './education-modal.component.html',
})
export class EducationModalComponent implements OnChanges {
  @Input() open = false;
  @Input() educations: Array<EducationPayload & { id?: string }> | null = [];

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<EducationFormValue>();

  @ViewChild(Step2Education) educationSection?: Step2Education;

  isSubmitting = false;
  formData: EducationFormValue = createEducationFormValue();
  private initialEducations: Array<EducationPayload & { id?: string }> = [];

  constructor(private readonly educationService: EducationService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['educations'] || changes['open']) {
      this.initialEducations = (this.educations ?? []).map((edu) => ({ ...edu }));
      this.formData = mapEducationModelsToForm(this.educations);
      this.isSubmitting = false;
    }
  }

  onDataChange(value: EducationFormValue): void {
    this.formData = {
      educations: value.educations.map((edu) => ({ ...edu })),
    };
  }

  onClose(): void {
    if (this.isSubmitting) return;
    this.close.emit();
  }

  onSave(): void {
    const errors = this.educationSection?.validate() || [];
    if (errors.length > 0 || this.isSubmitting) return;

    this.isSubmitting = true;

    const normalized = normalizeEducationFormValue(this.formData);

    const existingIds = new Set(
      (this.initialEducations ?? []).filter((edu) => !!edu.id).map((edu) => edu.id as string),
    );

    const currentIds = new Set(
      normalized.educations.filter((edu) => !!edu.id).map((edu) => edu.id as string),
    );

    const createRequests = normalized.educations
      .filter((edu) => !edu.id)
      .map(({ id, ...payload }) => this.educationService.create(payload));

    const updateRequests = normalized.educations
      .filter((edu) => !!edu.id)
      .map(({ id, ...payload }) => this.educationService.update(id as string, payload));

    const deleteRequests = [...existingIds]
      .filter((id) => !currentIds.has(id))
      .map((id) => this.educationService.delete(id));

    const requests = [...createRequests, ...updateRequests, ...deleteRequests];

    if (requests.length === 0) {
      this.isSubmitting = false;
      this.close.emit();
      return;
    }

    forkJoin(requests).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.saved.emit(normalized);
        this.close.emit();
      },
      error: (err) => {
        console.error('Gagal menyimpan pendidikan:', err);
        this.isSubmitting = false;
      },
    });
  }
}
