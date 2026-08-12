import { globalSendgrid } from './globals';
import { Transfer } from './transfer';

/**
 * SRP: una sola razón para cambiar - política y contenido de la notificación.
 *
 * Si el área de Comunicaciones modifica el copy del email, solo este archivo cambia.
 */
export class TransferNotifier {
  async notify(transfer: Transfer): Promise<void> {
    await globalSendgrid.send({
      to: transfer.customerEmail,
      subject: 'Transferencia procesada',
      text: `Tu transferencia por ${transfer.amount} fue procesada. Comisión aplicada: ${transfer.fee}.`,
    });
  }
}
