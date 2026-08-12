export type TransferType = 'INTERBANK' | 'SAME_BANK' | 'INTERNATIONAL';

export interface TransferInput {
  fromAccount: string;
  toAccount: string;
  amount: number;
  type: TransferType;
  customerEmail: string;
}

export interface Transfer extends TransferInput {
  fee: number;
  createdAt: Date;
}
