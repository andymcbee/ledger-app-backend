import { pool } from '../../config/db';
import { IOrganizationUser } from '../organizationUser/IOrganizationUser';

export const findAllOrganizationUsersByUserId = async (
  user_id: string
): Promise<IOrganizationUser[] | null> => {
  try {
    const query = `SELECT organization_id, user_id, id, user_role FROM organization_users WHERE user_id=$1`;

    const result = await pool.query(query, [user_id]);
    return result.rows || null;
  } catch (error) {
    console.log('Error fetching organization users:', error);
    throw 'Error fetching organization users.';
  }
};
