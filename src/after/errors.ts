export class InvalidAmountError extends Error {
  constructor(amount: number) {
    super(`Invalid transfer amount: ${amount}`);
    this.name = 'InvalidAmountError';
  }
}

export class AmountExceedsLimitError extends Error {
  constructor(amount: number, limit: number) {
    super(`Amount ${amount} exceeds limit ${limit}`);
    this.name = 'AmountExceedsLimitError';
  }
}

export class FraudDetectedError extends Error {
  constructor(account: string, risk: number) {
    super(`Fraud risk ${risk} detected for account ${account}`);
    this.name = 'FraudDetectedError';
  }
}
