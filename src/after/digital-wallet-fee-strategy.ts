import { FeeStrategy } from './fee-strategy';
import { TransferInput, TransferType } from './transfer';

export class DigitalWalletFeeStrategy implements FeeStrategy {
  supports(type: TransferType): boolean {
    return type === 'WALLET';
  }
  calculate(_input: TransferInput): number {
    return 1.5;
  }
}
