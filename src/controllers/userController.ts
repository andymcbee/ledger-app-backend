import { Request, Response } from 'express';
import { findOneUserByEmail } from '../model/user/findOneUserByEmail';
import { findOneUserByUserId } from '../model/user/findOneUserById';
import { fetchUserPassword } from '../model/user/fetchUserPassword';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../model/user/IUser';
import { IOrganizationUser } from '../model/organizationUser/IOrganizationUser';
import { IOrganization } from '../model/organization/IOrganization';
import { updateUser as updateUserInDb } from '../model/user/updateUser';
import { findAllOrganizationUsersByUserId } from '../model/organizationUser/findAllOrganizationUsersByUserId';
import { findOneOrganizationById } from '../model/organization/findOneOrganizationById';
export const login = async (req: Request, res: Response) => {
  try {
    const { user_email, user_password } = req.body;
    console.log('CONTROLLER, LOGIN::');
    console.log(user_email);
    console.log(user_password);

    if (!user_email) throw 'Email required';
    if (!user_password) throw 'Password required';

    const storedUserPasswordHash = await fetchUserPassword(user_email);

    //Might run into an issue here. I don't think bcrypt accepts null as a value.
    //If it throws an error... would that be an issue?... It would send a bad error message to frontend... but would that matter..
    //or is this only for undefined? Test it.

    const match = await bcrypt.compare(user_password, storedUserPasswordHash);

    if (!match) throw 'The username or password you entered is incorrect.';

    //Fetch User Details
    //Fetch User OrgIds
    //I think this is just the "me" logic?...

    const user = await findOneUserByEmail(user_email);

    const jwtExpiry = 86400;

    const jwtToken = await jwt.sign({ key: user.id }, process.env.JWT_SECRET, {
      expiresIn: jwtExpiry
    });

    res.cookie('jwt', jwtToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: jwtExpiry * 1000 //maxAge is in MS
    });
    res.status(200).json({
      success: true,
      message: `Login successful!`,
      data: {
        user
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { user_email, user_name, user_password } = req.body;
  const user_id = req.params.userId;

  console.log(user_id);
  // console.log(req.user_id);

  const userData: IUser = {
    id: user_id,
    email: user_email,
    name: user_name
  };

  if (user_password) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(user_password, salt);
    userData.password = passwordHash;
  }

  try {
    // if (user_id !== req.user_id) throw 'Unauthorized to update this user';

    const user = await updateUserInDb(userData);

    console.log(user);

    res.status(200).json({
      success: true,
      message: `Update user successful!`,
      data: {
        user
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error
    });
  }
};

export const me = async (req: Request, res: Response) => {
  const user_id = req.user_id;

  try {
    const user = await findOneUserByUserId(user_id);

    const userOrganizations = await findAllOrganizationUsersByUserId(user_id);

    interface CombinedOrgUserAndOrg {
      organization_id: IOrganization['id'];
      organization_name: IOrganization['name'];
      organization_user_role: IOrganizationUser['user_role'];
      organization_user_id: IOrganizationUser['id'];
      user_id: IOrganizationUser['user_id'];
    }

    const CombinedOrgUserAndOrgData: CombinedOrgUserAndOrg[] =
      await Promise.all(
        userOrganizations.map(async (item) => {
          const organization = await findOneOrganizationById(
            item.organization_id
          );
          return {
            organization_id: organization.id,
            organization_name: organization.name,
            organization_user_role: item.user_role,
            organization_user_id: item.id,
            user_id: item.user_id
          };
        })
      );

    res.status(200).json({
      success: true,
      message: `User data retrieved`,
      data: {
        user,
        organizations: CombinedOrgUserAndOrgData
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('jwt', { httpOnly: true, maxAge: 0 });
    res.status(200).json({
      success: true,
      message: `Log out successful!`
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error
    });
  }
};
