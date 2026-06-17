import { globalMysql } from './globals';
import { Transfer } from './transfer';

/**
 * SRP: una sola razón para cambiar - esquema y SQL de persistencia.
 */
export class TransferRepository {
  async save(transfer: Transfer): Promise<void> {
    const conn = await globalMysql.createConnection({
      host: 'db-prod',
      user: 'root',
      password: 'xxx',
    });
    try {
      await conn.query(`INSERT INTO transfers VALUES (?, ?, ?, ?, ?)`, [
        transfer.fromAccount,
        transfer.toAccount,
        transfer.amount,
        transfer.fee,
        transfer.createdAt,
      ]);
    } finally {
      await conn.end();
    }
  }
}
