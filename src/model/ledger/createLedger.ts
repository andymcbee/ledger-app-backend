import { pool } from '../../config/db';
import { ILedger } from './ILedger';
export const createLedger = async (
  ledger: ILedger
): Promise<ILedger | null> => {
  try {
    //convert this into a common utility function once confirmed it works and is secure
    const keys = Object.keys(ledger);
    const values = Object.values(ledger);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO ledgers(${keys}) VALUES (${placeholders}) RETURNING name, id, created_at`;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.log('Error creating ledger:', error);
    throw 'Error creating new ledger.';
  }
};
