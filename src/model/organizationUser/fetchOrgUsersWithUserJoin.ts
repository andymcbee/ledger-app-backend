import { pool } from '../../config/db';
import { CombinedOrgUserAndUser } from '../../controllers/organizationController';

export const fetchOrgUsersWithUserJoin = async (
  organization_id: string
): Promise<CombinedOrgUserAndUser[] | null> => {
  console.log(organization_id);
  try {
    const query = `SELECT
                        ou.organization_id,
                        ou.user_id,
                        ou.id,
                        ou.user_role,
                        u.name AS user_name,
                        u.email AS user_email
                    FROM
                        organization_users AS ou
                    JOIN
                        users AS u ON ou.user_id = u.id
                    WHERE
                        ou.organization_id = $1;`;

    const result = await pool.query(query, [organization_id]);
    console.log(result);
    return result.rows || null;
  } catch (error) {
    console.log('Error fetching organization users:', error);
    throw 'Error fetching organization users.';
  }
};
