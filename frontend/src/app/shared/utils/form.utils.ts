import { ElementRef } from '@angular/core';

export interface FieldError {
  field: string;
  message: string;
}

export type ErrorMap = Record<string, string>;

export function checkError(
  errors: ErrorMap,
  errs: FieldError[],
  condition: boolean,
  field: string,
  message: string,
): void {
  if (condition && !errors[field]) {
    errors[field] = message;
    errs.push({ field, message });
  }
}

export function clearError(errors: ErrorMap, field: string): void {
  delete errors[field];
}

export function hasError(errors: ErrorMap, field: string): boolean {
  return !!errors[field];
}

export function getError(errors: ErrorMap, field: string): string {
  return errors[field] || '';
}

export function scrollToFirstError(el: ElementRef, field: string): void {
  setTimeout(() => {
    const element = el.nativeElement.querySelector(`[data-field="${field}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
}
