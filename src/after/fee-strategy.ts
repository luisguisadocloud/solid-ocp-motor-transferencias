import { UnsupportedTransferTypeError } from "./errors";
import { TransferInput, TransferType } from "./transfer";

export interface FeeStrategy {
  supports(type: TransferType): boolean;
  calculate(input: TransferInput): number;
}

export class InterbankFeeStrategy implements FeeStrategy {
  supports(type: TransferType): boolean {
    return type === "INTERBANK";
  }

  calculate(input: TransferInput): number {
    return input.amount * 0.005;
  }
}

export class SameBankFreeStrategy implements FeeStrategy {
  supports(type: TransferType): boolean {
    return type === "SAME_BANK";
  }

  calculate(_input: TransferInput): number {
    return 0;
  }
}

export class InternationalFeeStrategy implements FeeStrategy {
  supports(type: TransferType): boolean {
    return type === "INTERNATIONAL";
  }
  
  calculate(input: TransferInput): number {
    return input.amount * 0.02 + 15;
  } 
}

export class FeeCalculator { 
  constructor(private readonly strategies: FeeStrategy[]) { }

  calculate(input: TransferInput): number { 
    const strategy = this.strategies.find(strategy => strategy.supports(input.type));
    if (!strategy) { 
      throw new UnsupportedTransferTypeError(input.type)
    }

    return strategy.calculate(input);
  }
}
