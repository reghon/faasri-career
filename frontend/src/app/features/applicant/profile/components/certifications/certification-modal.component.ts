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
  Certification,
  CertificationPayload,
  CertificationService,
} from '../../../../../domain/applicant';
import {
  CertificationSectionComponent,
  CertificationSectionValue,
  createCertificationSectionValue,
  normalizeCertificationSectionValue,
} from '../../../apply/components/step3-experience/certification/certification-section';
import { GenericModalComponent } from '../general/generic-modal.component';

interface CertificationFormItem extends CertificationPayload {
  id?: string;
}

interface CertificationFormValue {
  certifications: CertificationFormItem[];
}

@Component({
  selector: 'app-certification-modal',
  standalone: true,
  imports: [CommonModule, GenericModalComponent, CertificationSectionComponent],
  templateUrl: './certification-modal.component.html',
})
export class CertificationModalComponent implements OnChanges {
  @ViewChild(CertificationSectionComponent)
  certificationFormComponent?: CertificationSectionComponent;

  @Input() open = false;
  @Input() data: Certification[] | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  isSubmitting = false;

  formData: CertificationFormValue = this.createEmptyForm();
  originalCertifications: Certification[] = [];

  constructor(private readonly certificationService: CertificationService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['open']) {
      this.originalCertifications = this.data ? [...this.data] : [];
      this.formData = this.mapInputToForm(this.data);
    }
  }

  onClose(): void {
    if (this.isSubmitting) return;
    this.close.emit();
  }

  onDataChange(data: CertificationSectionValue): void {
    this.formData = {
      certifications: data.certifications.map((cert, index) => ({
        ...cert,
        id: this.formData.certifications[index]?.id,
      })),
    };
  }

  onSave(): void {
    const errors = this.certificationFormComponent?.validate() || [];
    if (errors.length > 0) return;

    this.isSubmitting = true;

    const normalized = this.normalizeFormValue(this.formData);

    const originalIds = new Set(this.originalCertifications.map((cert) => cert.id));
    const currentIds = new Set(
      normalized.certifications.filter((cert) => !!cert.id).map((cert) => cert.id as string),
    );

    const createRequests: Observable<unknown>[] = normalized.certifications
      .filter((cert) => !cert.id)
      .map((cert) => this.certificationService.create(this.toPayload(cert)));

    const updateRequests: Observable<unknown>[] = normalized.certifications
      .filter((cert) => !!cert.id)
      .map((cert) => this.certificationService.update(cert.id as string, this.toPayload(cert)));

    const deleteRequests: Observable<unknown>[] = this.originalCertifications
      .filter((cert) => originalIds.has(cert.id) && !currentIds.has(cert.id))
      .map((cert) => this.certificationService.delete(cert.id));

    const requests = [...createRequests, ...updateRequests, ...deleteRequests];
    const submit$ = requests.length > 0 ? forkJoin(requests) : of([]);

    submit$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.saved.emit();
        this.close.emit();
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }

  private createEmptyForm(): CertificationFormValue {
    return {
      certifications: createCertificationSectionValue().certifications.map((cert) => ({
        ...cert,
      })),
    };
  }

  private mapInputToForm(data: Certification[] | null): CertificationFormValue {
    if (!data || data.length === 0) {
      return this.createEmptyForm();
    }

    return {
      certifications: data.map((cert) => ({
        id: cert.id,
        name: cert.name || '',
        issuer: cert.issuer || '',
        issuedDay: cert.issuedDay || null,
        issuedMonth: cert.issuedMonth || null,
        issuedYear: cert.issuedYear || null,
        expiredDay: cert.expiredDay || null,
        expiredMonth: cert.expiredMonth || null,
        expiredYear: cert.expiredYear || null,
      })),
    };
  }

  private normalizeFormValue(data: CertificationFormValue): CertificationFormValue {
    const normalizedSection = normalizeCertificationSectionValue({
      certifications: data.certifications,
    });

    return {
      certifications: normalizedSection.certifications.map((cert, index) => ({
        ...cert,
        id: data.certifications[index]?.id,
      })),
    };
  }

  private toPayload(cert: CertificationFormItem): CertificationPayload {
    return {
      name: cert.name || '',
      issuer: cert.issuer || '',
      issuedDay: cert.issuedDay ?? null,
      issuedMonth: cert.issuedMonth ?? null,
      issuedYear: cert.issuedYear ?? null,
      expiredDay: cert.expiredDay ?? null,
      expiredMonth: cert.expiredMonth ?? null,
      expiredYear: cert.expiredYear ?? null,
    };
  }
}
