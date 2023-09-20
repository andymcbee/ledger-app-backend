import { pool } from '../../config/db';

export const fetchUserPassword = async (
  user_email: string
): Promise<string | null> => {
  try {
    console.log(user_email);
    const query = `SELECT password FROM users WHERE email=$1`;
    const result = await pool.query(query, [user_email]);
    console.log(result);
    return result.rows[0].password || null;
  } catch (error) {
    console.log('Error fetching user password:', error);
    throw 'Error fetching user password.';
  }
};
