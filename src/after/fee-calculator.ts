import { TransferInput } from './transfer';

/**
 * SRP: una sola razón para cambiar - reglas de pricing.
 *
 * Si el área de Pagos modifica una comisión, solo este archivo cambia.
 */
export class FeeCalculator {
  calculate(input: TransferInput): number {
    if (input.type === 'INTERBANK') return input.amount * 0.005;
    if (input.type === 'SAME_BANK') return 0;
    if (input.type === 'INTERNATIONAL') return input.amount * 0.02 + 15;
    return 0;
  }
}
