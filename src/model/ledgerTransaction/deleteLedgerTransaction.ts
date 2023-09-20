import { pool } from '../../config/db';
import { ILedgerTransaction } from './ILedgerTransaction';
export const deleteLedgerTransaction = async (
  ledgerTransaction: ILedgerTransaction
): Promise<ILedgerTransaction | null> => {
  try {
    //convert this into a common utility function once confirmed it works and is secure

    const { organization_id, id: ledger_transaction_id } = ledgerTransaction;

    const query = `DELETE FROM ledger_transactions WHERE id=$1 AND organization_id=$2 RETURNING id`;

    const result = await pool.query(query, [
      ledger_transaction_id,
      organization_id
    ]);
    return result.rows[0] || null;
  } catch (error) {
    console.log('Error deleting ledger:', error);
    throw 'Error deleting ledger.';
  }
};
