import { pool } from '../../config/db';
import { IUser } from './IUser';
export const findOneUserByUserId = async (
  user_id: string
): Promise<IUser | null> => {
  try {
    const query = `SELECT name, email, created_at, id FROM users WHERE id=$1`;

    const result = await pool.query(query, [user_id]);
    console.log('USER QUERY:::');
    console.log(result);
    return result.rows[0] || null;
  } catch (error) {
    console.log('Error fetching user:', error);
    throw 'Error fetching user.';
  }
};
