import { pool } from '../../config/db';
import { IOrganizationUser } from '../organizationUser/IOrganizationUser';

export const deleteOrganizationUser = async (
  organization_user_id: string,
  organization_id: string
): Promise<IOrganizationUser | null> => {
  try {
    const query = `DELETE FROM organization_users WHERE id=$1 AND organization_id=$2 RETURNING id`;

    const result = await pool.query(query, [
      organization_user_id,
      organization_id
    ]);
    console.log(result);
    return result.rows[0] || null;
  } catch (error) {
    console.log('Error deleting organization user:', error);
    throw 'Error deleting organization user.';
  }
};
