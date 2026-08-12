import { AmountExceedsLimitError, InvalidAmountError } from './errors';
import { TransferInput } from './transfer';

/**
 * SRP: una sola razón para cambiar - reglas de validación de montos.
 *
 * Si el área de Riesgos cambia el límite, este es el único archivo a tocar.
 * No conoce comisiones, antifraude, persistencia ni notificación.
 */
export class TransferValidator {
  private readonly MAX_AMOUNT = 50000;

  validate(input: TransferInput): void {
    if (input.amount <= 0) throw new InvalidAmountError(input.amount);
    if (input.amount > this.MAX_AMOUNT) {
      throw new AmountExceedsLimitError(input.amount, this.MAX_AMOUNT);
    }
  }
}
