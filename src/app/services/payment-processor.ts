import type { RawRow } from '../models/validation.models';
import { validatePayment } from './validator';

// The only place where spreadsheet column names (the file's contract) appear.
export const COLUMNS = {
  beneficiary: 'Beneficiario',
  clabe: 'CLABE',
  amount: 'Importe',
  status: 'estado',
  errorMessage: 'motivo_error',
} as const;

export const STATUS_LABELS = {
  valid: 'válido',
  invalid: 'inválido',
} as const;


export function processRows(rows: RawRow[]): RawRow[] {
  return rows.map((row) => {
    const result = validatePayment({
      beneficiary: row[COLUMNS.beneficiary],
      clabe: row[COLUMNS.clabe],
      amount: row[COLUMNS.amount],
    });

    return {
      ...row,
      [COLUMNS.status]: STATUS_LABELS[result.status],
      [COLUMNS.errorMessage]: result.errorMessage,
    };
  });
}