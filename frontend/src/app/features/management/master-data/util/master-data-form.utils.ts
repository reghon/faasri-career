import { FieldConfig } from '../config/master-data.config';

export function buildInitialForm(fields: FieldConfig[]): Record<string, any> {
  const form: Record<string, any> = {};

  for (const field of fields) {
    if (field.type === 'switch') {
      form[field.key] = field.key === 'isActive';
      continue;
    }
    if (field.type === 'number') {
      form[field.key] = 0;
      continue;
    }
    form[field.key] = '';
  }

  return form;
}

export function buildFormFromRecord(
  fields: FieldConfig[],
  record: Record<string, any>,
): Record<string, any> {
  const form: Record<string, any> = {};

  for (const field of fields) {
    form[field.key] =
      field.type === 'switch' ? Boolean(record[field.key]) : (record[field.key] ?? '');
  }

  return form;
}

export function validateForm(
  fields: FieldConfig[],
  form: Record<string, any>,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    if (field.type === 'switch') continue;
    const value = String(form[field.key] ?? '').trim();
    if (field.required && !value) errors[field.key] = `${field.label} is required`;
  }

  return errors;
}

export function buildPayload(
  fields: FieldConfig[],
  form: Record<string, any>,
): Record<string, any> {
  const payload: Record<string, any> = {};

  for (const field of fields) {
    if (field.type === 'switch') {
      payload[field.key] = Boolean(form[field.key]);
      continue;
    }
    if (field.type === 'number') {
      payload[field.key] = Number(form[field.key] ?? 0);
      continue;
    }
    const raw = String(form[field.key] ?? '').trim();
    payload[field.key] = raw === '' ? null : raw;
  }

  return payload;
}

export function clearFieldError(
  errors: Record<string, string>,
  key: string,
): Record<string, string> {
  if (!errors[key]) return errors;
  const next = { ...errors };
  delete next[key];
  return next;
}
