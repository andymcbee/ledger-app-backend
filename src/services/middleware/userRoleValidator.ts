import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../types/UserRole';

// This middleware relies on the userAuth to happen first
// because the userAuth middleware appends req.user_role to Request.
export const userRoleValidator =
  (user_role: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('MIDDLEWARE HIT....');
    console.log('PARAM:::');
    //console.log(user_role);
    console.log('REQUEST.USER:::');
    //  console.log(req.user_role);
    //   if (user_role.includes(req.user_role)) next();
  };
