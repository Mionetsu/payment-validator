import type { PaymentInput, ValidationResult } from '../models/validation.models';

const CLABE_LENGTH = 18;

export function validateBeneficiary(value: unknown): string | null {
  const text = String(value ?? '').trim();

  if (text === '') {
    return 'El beneficiario está vacío';
  }

  return null;
}

export function validateClabe(value: unknown): string | null {
  if (typeof value === 'number') {
    return 'La CLABE está guardada como número; Excel pierde dígitos, debe ser texto';
  }

  const text = String(value ?? '').trim();

  if (text === '') {
    return 'La CLABE está vacía';
  }

  const clabe = text.replace(/\s/g, '');

  if (!/^\d+$/.test(clabe)) {
    return 'La CLABE contiene caracteres que no son dígitos';
  }

  if (clabe.length !== CLABE_LENGTH) {
    return `La CLABE tiene ${clabe.length} dígitos (debe tener ${CLABE_LENGTH})`;
  }

  return null;
}

export function validateAmount(value: unknown): string | null {
  if (value === null || value === undefined || String(value).trim() === '') {
    return 'El importe está vacío';
  }

  
  const amount =
    typeof value === 'number' ? value : Number(String(value).replace(/[$,\s]/g, ''));

  if (!Number.isFinite(amount)) {
    return 'El importe no es numérico';
  }

  if (amount <= 0) {
    return 'El importe debe ser mayor a cero';
  }

  const decimals = String(amount).split('.')[1] ?? '';

  if (decimals.length > 2) {
    return `El importe tiene ${decimals.length} decimales (máximo 2)`;
  }

  return null;
}


export function validatePayment(input: PaymentInput): ValidationResult {
  const errors = [
    validateBeneficiary(input.beneficiary),
    validateClabe(input.clabe),
    validateAmount(input.amount),
  ].filter((error): error is string => error !== null);

  if (errors.length === 0) {
    return { status: 'valid', errorMessage: '' };
  }

  return { status: 'invalid', errorMessage: errors.join('; ') };
}