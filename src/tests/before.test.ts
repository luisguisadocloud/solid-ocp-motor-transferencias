import { AmountExceedsLimitError, InvalidAmountError } from '../before/errors';
import { FeeCalculator } from '../before/fee-calculator';
import { TransferInput } from '../before/transfer';
import { TransferValidator } from '../before/transfer-validator';

const baseInput: TransferInput = {
  fromAccount: '194-12345',
  toAccount: '011-98765',
  amount: 1000,
  type: 'INTERBANK',
  customerEmail: 'cliente@example.com',
};

describe('TransferValidator (punto de partida: SRP ya aplicado)', () => {
  const validator = new TransferValidator();

  it('acepta monto válido', () => {
    expect(() => validator.validate(baseInput)).not.toThrow();
  });

  it('rechaza monto cero', () => {
    expect(() => validator.validate({ ...baseInput, amount: 0 })).toThrow(InvalidAmountError);
  });

  it('rechaza monto sobre el límite', () => {
    expect(() => validator.validate({ ...baseInput, amount: 60000 })).toThrow(
      AmountExceedsLimitError,
    );
  });
});

describe('FeeCalculator (BEFORE - if/else cerrado a extensión)', () => {
  const calculator = new FeeCalculator();

  it.each([
    ['INTERBANK', 1000, 5],
    ['SAME_BANK', 1000, 0],
    ['INTERNATIONAL', 1000, 35],
  ] as const)('calcula comisión para %s', (type, amount, expected) => {
    expect(calculator.calculate({ ...baseInput, type, amount })).toBe(expected);
  });
});
