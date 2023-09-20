import { pool } from '../../config/db';
import { ILedgerTransaction } from './ILedgerTransaction';

export const fetchLedgerTransactions = async (
  ledger_id: string,
  organization_id: string
): Promise<ILedgerTransaction[] | null> => {
  try {
    const query = `SELECT id, organization_id, ledger_id, amount_cents, transaction_date, transaction_type, created_at, description 
                    FROM ledger_transactions 
                    WHERE organization_id=$1 
                    AND ledger_id=$2
                    ORDER BY created_at DESC`;

    const result = await pool.query(query, [organization_id, ledger_id]);
    return result.rows || null;
  } catch (error) {
    console.log('Error fetching ledger transactions', error);
    throw 'Error fetching ledger transactions.';
  }
};
