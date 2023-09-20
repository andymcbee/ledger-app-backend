import { Request, Response, NextFunction } from 'express';
import { findOneOrganizationUser } from '../../model/organizationUser/findOneOrganizationUser';

// This middleware performs the actions:
// Confirm user belongs to org
// Must occur after userAuth
export const orgUserAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { organizationId } = req.params;

  const user_id = req.user_id;

  if (!user_id) {
    return res.status(401).json({ message: 'Authentication denied.' });
  }

  try {
    //fetch org_id from db
    const valid_organization_id = await findOneOrganizationUser(
      user_id,
      organizationId
    );

    req.user_role = valid_organization_id.user_role;

    if (!valid_organization_id) {
      return res.status(401).json({ message: 'Authentication denied!' });
    }

    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.log('ERROR IN ORG USERAUTH:::::::::::::::::');
    console.log(error);
    return res.status(403).json({ message: 'Invalid user org auth' });
  }
};
