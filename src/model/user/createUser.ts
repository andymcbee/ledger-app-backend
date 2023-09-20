import { pool } from '../../config/db';
import { IUser } from './IUser';

export const createUser = async (user: IUser): Promise<IUser | null> => {
  try {
    //convert this into a common utility function once confirmed it works and is secure
    const keys = Object.keys(user);
    const values = Object.values(user);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO users(${keys}) VALUES (${placeholders}) RETURNING name, email, created_at, id`;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.log('Error creating user:', error);
    throw 'Error creating new user.';
  }
};
