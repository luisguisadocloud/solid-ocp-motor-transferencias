import { DigitalWalletFeeStrategy } from './digital-wallet-fee-strategy';
import { FeeCalculator, InterbankFeeStrategy, InternationalFeeStrategy, SameBankFreeStrategy } from './fee-strategy';
import { FraudChecker } from './fraud-checker';
import { TransferInput } from './transfer';
import { TransferNotifier } from './transfer-notifier';
import { TransferRepository } from './transfer-repository';
import { TransferValidator } from './transfer-validator';

export class TransferService {
  private readonly validator = new TransferValidator();
  private readonly feeCalculator = new FeeCalculator([
    new SameBankFreeStrategy(),
    new InterbankFeeStrategy(),
    new InternationalFeeStrategy(),
    new DigitalWalletFeeStrategy(),
  ]);
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
