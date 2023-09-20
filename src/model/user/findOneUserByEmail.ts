import { pool } from '../../config/db';
import { IUser } from './IUser';
export const findOneUserByEmail = async (
  email: string
): Promise<IUser | null> => {
  try {
    const query = `SELECT name, email, created_at, id FROM users WHERE email=$1`;

    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.log('Error fetching user:', error);
    throw 'Error fetching user.';
  }
};
