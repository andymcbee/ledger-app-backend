import { pool } from '../../config/db';
import { ILedgerTransaction } from './ILedgerTransaction';
export const createLedgerTransaction = async (
  ledgerTransaction: ILedgerTransaction
): Promise<ILedgerTransaction | null> => {
  try {
    //convert this into a common utility function once confirmed it works and is secure
    const keys = Object.keys(ledgerTransaction);
    const values = Object.values(ledgerTransaction);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO ledger_transactions(${keys}) VALUES (${placeholders}) RETURNING id, organization_id, ledger_id, amount_cents, transaction_date, transaction_type, created_at`;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.log('Error creating ledger transaction:', error);
    throw 'Error creating new ledger transaction.';
  }
};
