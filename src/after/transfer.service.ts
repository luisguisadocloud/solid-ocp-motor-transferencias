import { TransferInput } from './transfer';
import { TransferValidator } from './transfer-validator';
import { FeeCalculator } from './fee-calculator';
import { FraudChecker } from './fraud-checker';
import { TransferRepository } from './transfer-repository';
import { TransferNotifier } from './transfer-notifier';

/**
 * Caso de uso SRP: orquesta cinco colaboradores, cada uno con UNA responsabilidad.
 */
export class TransferService {
  private readonly validator = new TransferValidator();
  private readonly feeCalculator = new FeeCalculator();
  private readonly fraudChecker = new FraudChecker();
  private readonly repository = new TransferRepository();
  private readonly notifier = new TransferNotifier();

  async execute(input: TransferInput): Promise<void> {
    this.validator.validate(input);
    await this.fraudChecker.assertNotFraudulent(input);

    const fee = this.feeCalculator.calculate(input);
    const transfer = { ...input, fee, createdAt: new Date() };

    await this.repository.save(transfer);
    await this.notifier.notify(transfer);
  }
}
