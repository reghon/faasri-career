import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmModal } from '../../../../../../shared/components/confirm-modal/confirm-modal';
import { CertificationPayload } from '../../../../../../domain/applicant';
import {
  FieldError,
  ErrorMap,
  checkError,
  scrollToFirstError,
  MONTHS,
  DAYS,
  YEARS,
} from '../../../../../../shared/utils';

export interface CertificationFormItem extends CertificationPayload {
  id?: string;
}

export interface CertificationSectionValue {
  certifications: CertificationFormItem[];
}

export function createCertificationItem(): CertificationFormItem {
  return {
    name: '',
    issuer: '',
    issuedDay: '',
    issuedMonth: '',
    issuedYear: '',
    expiredDay: '',
    expiredMonth: '',
    expiredYear: '',
  };
}

export function createCertificationSectionValue(): CertificationSectionValue {
  return {
    certifications: [createCertificationItem()],
  };
}

export function mapCertificationModelsToForm(
  certifications: Array<CertificationPayload & { id?: string }> | null | undefined,
): CertificationSectionValue {
  if (!certifications || certifications.length === 0) {
    return createCertificationSectionValue();
  }

  return {
    certifications: certifications.map((cert) => ({
      id: cert.id,
      name: cert.name || '',
      issuer: cert.issuer || '',
      issuedDay: cert.issuedDay || '',
      issuedMonth: cert.issuedMonth || '',
      issuedYear: cert.issuedYear || '',
      expiredDay: cert.expiredDay || '',
      expiredMonth: cert.expiredMonth || '',
      expiredYear: cert.expiredYear || '',
    })),
  };
}

export function normalizeCertificationFormItem(cert: CertificationFormItem): CertificationFormItem {
  return {
    id: cert.id,
    name: cert.name,
    issuer: cert.issuer,
    issuedDay: cert.issuedDay || null,
    issuedMonth: cert.issuedMonth || null,
    issuedYear: cert.issuedYear || null,
    expiredDay: cert.expiredDay || null,
    expiredMonth: cert.expiredMonth || null,
    expiredYear: cert.expiredYear || null,
  };
}

export function normalizeCertificationSectionValue(
  data: CertificationSectionValue,
): CertificationSectionValue {
  return {
    certifications: data.certifications.map((cert) => normalizeCertificationFormItem(cert)),
  };
}

@Component({
  selector: 'app-certification-section',
  standalone: true,
  imports: [FormsModule, ConfirmModal],
  templateUrl: './certification-section.html',
})
export class CertificationSectionComponent {
  @Input() data!: CertificationSectionValue;
  @Output() dataChange = new EventEmitter<CertificationSectionValue>();

  errors: ErrorMap = {};
  showDeleteCertModal = false;
  deleteCertIndex = -1;

  readonly months = MONTHS;
  readonly days = DAYS;
  readonly years = YEARS;

  constructor(private readonly el: ElementRef) {}

  onChange(field?: string): void {
    if (field) this.clearError(field);
    this.dataChange.emit(this.data);
  }

  clearError(field: string): void {
    delete this.errors[field];
  }

  hasError(field: string): boolean {
    return !!this.errors[field];
  }

  getError(field: string): string {
    return this.errors[field] || '';
  }

  addCertification(): void {
    this.data.certifications.push(createCertificationItem());
    this.onChange();
  }

  confirmRemoveCertification(index: number): void {
    this.deleteCertIndex = index;
    this.showDeleteCertModal = true;
  }

  onConfirmDeleteCert(): void {
    if (this.deleteCertIndex < 0 || this.deleteCertIndex >= this.data.certifications.length) {
      return;
    }

    this.data.certifications.splice(this.deleteCertIndex, 1);
    this.showDeleteCertModal = false;
    this.deleteCertIndex = -1;
    this.onChange();
  }

  onCancelDeleteCert(): void {
    this.showDeleteCertModal = false;
    this.deleteCertIndex = -1;
  }

  validate(): FieldError[] {
    this.errors = {};
    const errs: FieldError[] = [];

    const check = (condition: boolean, field: string, message: string) =>
      checkError(this.errors, errs, condition, field, message);

    this.data.certifications.forEach((cert, i) => {
      check(!cert.name, `cert-${i}-name`, 'Nama sertifikat wajib diisi');
      check(!cert.issuer, `cert-${i}-issuer`, 'Penerbit sertifikat wajib diisi');

      check(
        !cert.issuedDay || !cert.issuedMonth || !cert.issuedYear,
        `cert-${i}-issued`,
        'Tanggal diterbitkan wajib diisi lengkap',
      );

      check(
        !cert.expiredDay || !cert.expiredMonth || !cert.expiredYear,
        `cert-${i}-expired`,
        'Tanggal kadaluwarsa wajib diisi lengkap',
      );

      const issuedDate = this.toComparableDate(cert.issuedDay, cert.issuedMonth, cert.issuedYear);
      const expiredDate = this.toComparableDate(
        cert.expiredDay,
        cert.expiredMonth,
        cert.expiredYear,
      );

      check(
        !!cert.issuedDay && !!cert.issuedMonth && !!cert.issuedYear && issuedDate === null,
        `cert-${i}-issued`,
        'Tanggal diterbitkan tidak valid',
      );

      check(
        !!cert.expiredDay && !!cert.expiredMonth && !!cert.expiredYear && expiredDate === null,
        `cert-${i}-expired`,
        'Tanggal kadaluwarsa tidak valid',
      );

      check(
        issuedDate !== null && expiredDate !== null && expiredDate < issuedDate,
        `cert-${i}-expired`,
        'Tanggal kadaluwarsa tidak boleh lebih awal dari tanggal diterbitkan',
      );
    });

    if (errs.length > 0) {
      scrollToFirstError(this.el, errs[0].field);
    }

    return errs;
  }

  private toComparableDate(
    day?: string | null,
    month?: string | null,
    year?: string | null,
  ): number | null {
    if (!day || !month || !year) return null;

    const parsedDay = Number(day);
    const parsedMonth = Number(month);
    const parsedYear = Number(year);

    if (Number.isNaN(parsedDay) || Number.isNaN(parsedMonth) || Number.isNaN(parsedYear)) {
      return null;
    }

    const date = new Date(parsedYear, parsedMonth - 1, parsedDay);

    if (
      date.getFullYear() !== parsedYear ||
      date.getMonth() !== parsedMonth - 1 ||
      date.getDate() !== parsedDay
    ) {
      return null;
    }

    return date.getTime();
  }
}
