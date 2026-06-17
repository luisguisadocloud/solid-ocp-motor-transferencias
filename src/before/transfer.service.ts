export type TransferType = 'INTERBANK' | 'SAME_BANK' | 'INTERNATIONAL';

export interface TransferInput {
  fromAccount: string;
  toAccount: string;
  amount: number;
  type: TransferType;
  customerEmail: string;
}

declare const fetch: (url: string) => Promise<{ json: () => Promise<{ risk: number }> }>;
declare const mysql: {
  createConnection: (cfg: object) => Promise<{
    query: (sql: string, params: unknown[]) => Promise<void>;
    end: () => Promise<void>;
  }>;
};
declare const sendgrid: {
  send: (msg: { to: string; subject: string; text: string }) => Promise<void>;
};

export class TransferService {
  async execute(input: TransferInput): Promise<void> {
    // 1. Validar el monto (responsabilidad: reglas de negocio de validación)
    if (input.amount <= 0) throw new Error('Invalid amount');
    if (input.amount > 50000) throw new Error('Amount exceeds limit');

    // 2. Calcular comisión según tipo (responsabilidad: pricing)
    let fee = 0;
    if (input.type === 'INTERBANK') {
      fee = input.amount * 0.005;
    } else if (input.type === 'SAME_BANK') {
      fee = 0;
    } else if (input.type === 'INTERNATIONAL') {
      fee = input.amount * 0.02 + 15;
    }

    // 3. Verificar fraude (responsabilidad: antifraude)
    const fraudResponse = await fetch(
      `https://fraud-api.internal/check?account=${input.fromAccount}`,
    );
    const fraudPayload = await fraudResponse.json();
    if (fraudPayload.risk > 0.8) throw new Error('Fraud detected');

    // 4. Persistir (responsabilidad: almacenamiento)
    const conn = await mysql.createConnection({
      host: 'db-prod',
      user: 'root',
      password: 'xxx',
    });
    try {
      await conn.query(`INSERT INTO transfers VALUES (?, ?, ?, ?, ?)`, [
        input.fromAccount,
        input.toAccount,
        input.amount,
        fee,
        new Date(),
      ]);
    } finally {
      await conn.end();
    }

    // 5. Notificar (responsabilidad: comunicaciones)
    await sendgrid.send({
      to: input.customerEmail,
      subject: 'Transferencia procesada',
      text: `Tu transferencia de S/ ${input.amount} fue procesada.`,
    });
  }
}
