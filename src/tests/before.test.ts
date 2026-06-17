import { TransferInput, TransferService } from '../before/transfer.service';

// Mockeo manual de los globales declarados en before/transfer.service.ts.
const globalAny = global as unknown as {
  fetch: jest.Mock;
  mysql: { createConnection: jest.Mock };
  sendgrid: { send: jest.Mock };
};

describe('TransferService (BEFORE - monolítico)', () => {
  let mysqlConn: { query: jest.Mock; end: jest.Mock };

  beforeEach(() => {
    mysqlConn = { query: jest.fn().mockResolvedValue(undefined), end: jest.fn().mockResolvedValue(undefined) };
    globalAny.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve({ risk: 0.1 }) });
    globalAny.mysql = { createConnection: jest.fn().mockResolvedValue(mysqlConn) };
    globalAny.sendgrid = { send: jest.fn().mockResolvedValue(undefined) };
  });

  const validInput: TransferInput = {
    fromAccount: '194-12345',
    toAccount: '011-98765',
    amount: 1000,
    type: 'INTERBANK',
    customerEmail: 'cliente@example.com',
  };

  it('rechaza monto cero o negativo', async () => {
    const service = new TransferService();
    await expect(service.execute({ ...validInput, amount: 0 })).rejects.toThrow('Invalid amount');
  });

  it('rechaza monto sobre el límite', async () => {
    const service = new TransferService();
    await expect(service.execute({ ...validInput, amount: 100000 })).rejects.toThrow(
      'Amount exceeds limit',
    );
  });

  it('rechaza cuando el riesgo de fraude es alto', async () => {
    globalAny.fetch = jest
      .fn()
      .mockResolvedValue({ json: () => Promise.resolve({ risk: 0.95 }) });
    const service = new TransferService();
    await expect(service.execute(validInput)).rejects.toThrow('Fraud detected');
  });

  it('procesa una transferencia válida', async () => {
    const service = new TransferService();
    await service.execute(validInput);
    expect(mysqlConn.query).toHaveBeenCalled();
    expect(globalAny.sendgrid.send).toHaveBeenCalled();
  });
});
