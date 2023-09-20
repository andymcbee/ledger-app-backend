import { pool } from '../../config/db';
import { IUser } from './IUser';

export const updateUser = async (user: IUser): Promise<IUser | null> => {
  if (!user.id) throw 'Error updating user. Please provide a user id.';

  let query = 'UPDATE users SET';
  const queryValues = [user.id];
  const values = Object.values(user);
  const keys = Object.keys(user);

  for (let i = 0; i < keys.length; i++) {
    const currKey = keys[i];
    const currValue = values[i];
    if (
      (currKey === 'email' || currKey === 'name' || currKey === 'password') &&
      currValue
    ) {
      query = query + ` ${currKey}=$${queryValues.length + 1},`;

      if (i === keys.length - 1) {
        query = query.slice(0, -1); // remove last comma
      }
      queryValues.push(currValue);
    }
  }

  query = query + ' WHERE ID=$1 RETURNING name, email, id';

  const result = await pool.query(query, queryValues);

  return result.rows[0] || null;
};
