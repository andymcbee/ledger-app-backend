import { pool } from '../../config/db';
import { IOrganization } from '../organization/IOrganization';

export const findOneOrganizationById = async (
  organization_id: string
): Promise<IOrganization | null> => {
  try {
    const query = `SELECT id, name FROM organizations WHERE id=$1`;

    const result = await pool.query(query, [organization_id]);
    return result.rows[0] || null;
  } catch (error) {
    console.log('Error fetching organization:', error);
    throw 'Error fetching organization.';
  }
};
