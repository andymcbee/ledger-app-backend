import { pool } from '../../config/db';
import { ILedger } from './ILedger';
export const deleteLedger = async (
  ledger: ILedger
): Promise<ILedger | null> => {
  try {
    //convert this into a common utility function once confirmed it works and is secure

    console.log('LEDGER DATA INSIDE MODEL:::');
    console.log(ledger);

    const { organization_id, id: ledger_id } = ledger;

    const query = `DELETE FROM ledgers WHERE id=$1 AND organization_id=$2 RETURNING id`;

    const result = await pool.query(query, [ledger_id, organization_id]);
    return result.rows[0] || null;
  } catch (error) {
    console.log('Error deleting ledger:', error);
    throw 'Error deleting ledger.';
  }
};

//DELETE FROM ledger WHERE id='0fa0ab53-af69-489f-96ac-ac42712005f1' AND organization_id='1239ddeb-0ce7-4482-b037-6b25b47d9647'
