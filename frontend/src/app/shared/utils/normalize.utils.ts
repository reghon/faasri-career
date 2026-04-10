export function normalizeText(value: string | null | undefined): string | null {
  const result = (value ?? '').trim();
  return result || null;
}

export function normalizeDigits(value: string | null | undefined): string | null {
  const result = (value ?? '').replace(/\D/g, '');
  return result || null;
}

export function normalizeEmail(value: string | null | undefined): string | null {
  const result = (value ?? '').trim().toLowerCase();
  return result || null;
}

export function isValidEmail(email: string | null | undefined): boolean {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
