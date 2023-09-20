import { UserRole } from '../UserRole';

declare global {
  namespace Express {
    interface Request {
      user_id?: string;
      user_role?: UserRole;
    }
  }
}
