export type RawRow = Record<string, unknown>;

export interface PaymentInput {
    beneficiary: unknown;
    clabe: unknown;
    amount: unknown;
}

export type RowStatus =  'valid' | 'invalid';

export interface ValidationResult {
    status: RowStatus;
    errorMessage: string;
}