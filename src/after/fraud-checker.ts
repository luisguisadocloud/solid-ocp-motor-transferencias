import { FraudDetectedError } from './errors';
import { globalFetch } from './globals';
import { TransferInput } from './transfer';

/**
 * SRP: una sola razón para cambiar - política antifraude.
 *
 * Si el área de Antifraude cambia el threshold o la fuente del score,
 * solo este archivo cambia.
 */
export class FraudChecker {
  private readonly RISK_THRESHOLD = 0.8;
  private readonly FRAUD_API_URL = 'https://fraud-api.internal';

  async assertNotFraudulent(input: TransferInput): Promise<void> {
    const response = await globalFetch(
      `${this.FRAUD_API_URL}/check?account=${input.fromAccount}`,
    );
    const payload = await response.json();
    if (payload.risk > this.RISK_THRESHOLD) {
      throw new FraudDetectedError(input.fromAccount, payload.risk);
    }
  }
}
