import { pool } from '../../config/db';
import { ILedgerUser } from './ILedgerUser';
export const createLedgerUser = async (
  ledgerUser: ILedgerUser
): Promise<ILedgerUser | null> => {
  try {
    console.log('LEDGER USER::::');
    console.log(ledgerUser);
    //convert this into a common utility function once confirmed it works and is secure
    const keys = Object.keys(ledgerUser);
    const values = Object.values(ledgerUser);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO ledger_users(${keys}) VALUES (${placeholders}) RETURNING user_id, ledger_id, organization_id, id, created_at`;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.log('Error creating ledger user:', error);
    throw 'Error creating new ledger user.';
  }
};
