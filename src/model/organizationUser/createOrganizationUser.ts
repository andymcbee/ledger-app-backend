import { pool } from '../../config/db';
import { IOrganizationUser } from './IOrganizationUser';

export const createOrganizationUser = async (
  organizationUser: IOrganizationUser
): Promise<IOrganizationUser | null> => {
  try {
    //convert this into a common utility function once confirmed it works and is secure
    const keys = Object.keys(organizationUser);
    const values = Object.values(organizationUser);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO organization_users(${keys}) VALUES (${placeholders}) RETURNING id, organization_id, user_id, created_at`;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.log('Error creating organizationUser:', error);
    throw 'Error creating new organizationUser.';
  }
};
