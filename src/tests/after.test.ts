import { UnsupportedTransferTypeError } from '../after/errors';
import { DigitalWalletFeeStrategy } from '../after/digital-wallet-fee-strategy';
import {
  FeeCalculator,
  InterbankFeeStrategy,
  InternationalFeeStrategy,
  SameBankFreeStrategy,
} from '../after/fee-strategy';
import { TransferInput } from '../after/transfer';

const baseInput: TransferInput = {
  fromAccount: '194-12345',
  toAccount: '011-98765',
  amount: 1000,
  type: 'INTERBANK',
  customerEmail: 'cliente@example.com',
};

function buildCalculator(): FeeCalculator {
  return new FeeCalculator([
    new SameBankFreeStrategy(),
    new InterbankFeeStrategy(),
    new InternationalFeeStrategy(),
    new DigitalWalletFeeStrategy(),
  ]);
}

describe('FeeCalculator (AFTER - Strategy pattern, abierto a extensión)', () => {
  it.each([
    ['INTERBANK', 1000, 5],
    ['SAME_BANK', 1000, 0],
    ['INTERNATIONAL', 1000, 35],
    ['WALLET', 1000, 1.5],
  ] as const)('calcula comisión para %s delegando en su estrategia', (type, amount, expected) => {
    expect(buildCalculator().calculate({ ...baseInput, type, amount })).toBe(expected);
  });

  it('lanza UnsupportedTransferTypeError si ninguna estrategia soporta el tipo', () => {
    const calculator = new FeeCalculator([new InterbankFeeStrategy()]);
    expect(() => calculator.calculate({ ...baseInput, type: 'WALLET' })).toThrow(
      UnsupportedTransferTypeError,
    );
  });
});
