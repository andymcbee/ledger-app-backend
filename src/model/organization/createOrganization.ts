import { pool } from '../../config/db';
import { IOrganization } from './IOrganization';

export const createOrganization = async (
  organization: IOrganization
): Promise<IOrganization | null> => {
  try {
    //convert this into a common utility function once confirmed it works and is secure
    const keys = Object.keys(organization);
    const values = Object.values(organization);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO organizations(${keys}) VALUES (${placeholders}) RETURNING name, id, created_at`;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.log('Error creating account:', error);
    throw 'Error creating new account.';
  }
};
