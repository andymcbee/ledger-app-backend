import { pool } from '../../config/db';
import { ILedger } from './ILedger';

export const fetchOrgLedgers = async (
  organization_id: string
): Promise<ILedger[] | null> => {
  try {
    const query = `
    SELECT
    l.id AS ledger_id,
    l.name AS ledger_name,
    COALESCE(SUM(CASE WHEN lt.amount_cents IS NOT NULL THEN lt.amount_cents ELSE 0 END), 0) AS total_amount_cents
FROM
    ledgers l
LEFT JOIN
    ledger_transactions lt ON l.id = lt.ledger_id
WHERE
    l.organization_id = $1
GROUP BY
    l.id, l.name
ORDER BY
    l.id;`;

    const result = await pool.query(query, [organization_id]);
    return result.rows || null;
  } catch (error) {
    console.log('Error fetching ledgers:', error);
    throw 'Error fetching ledgers.';
  }
};
