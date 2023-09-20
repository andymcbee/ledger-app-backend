import { pool } from '../../config/db';
import { IOrganizationUser } from '../organizationUser/IOrganizationUser';

export const findOneOrganizationUser = async (
  user_id: string,
  organization_id: string
): Promise<IOrganizationUser | null> => {
  try {
    const query = `SELECT organization_id, user_id, id, user_role FROM organization_users WHERE user_id=$1 AND organization_id=$2`;

    const result = await pool.query(query, [user_id, organization_id]);
    return result.rows[0] || null;
  } catch (error) {
    console.log('Error fetching organization user:', error);
    throw 'Error fetching organization user.';
  }
};
