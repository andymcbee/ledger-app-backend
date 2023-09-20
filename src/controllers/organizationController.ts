import { Request, Response } from 'express';
import { createUser as createUserInDb } from '../model/user/createUser';
import { createOrganizationUser as createOrganizationUserInDb } from '../model/organizationUser/createOrganizationUser';
import { deleteOrganizationUser as deleteOrganizationUserInDb } from '../model/organizationUser/deleteOrganizationUser';
import { fetchOrgUsersWithUserJoin } from '../model/organizationUser/fetchOrgUsersWithUserJoin';
import { fetchSingleOrgUserWithUserJoin } from '../model/organizationUser/fetchSingleOrgUserWithUserJoin';

import { v4 as uuidv4 } from 'uuid';
import { findOneUserByEmail } from '../model/user/findOneUserByEmail';
import { IUser } from '../model/user/IUser';
import { IOrganizationUser } from '../model/organizationUser/IOrganizationUser';
import bcrypt from 'bcrypt';
import { UserRole } from '../types/UserRole';
import { findOneOrganizationUser } from '../model/organizationUser/findOneOrganizationUser';

export const createOrganizationUser = async (req: Request, res: Response) => {
  try {
    const { user_email, user_role, user_name } = req.body;
    const { organizationId: organization_id } = req.params;

    const existingUser = await findOneUserByEmail(user_email);

    const userData: IUser = {
      id: existingUser ? existingUser.id : uuidv4(),
      email: user_email,
      name: user_name
    };

    if (existingUser) {
      const existingOrgUser = await findOneOrganizationUser(
        userData.id,
        organization_id
      );

      if (existingOrgUser) throw 'User exists in organization already.';
    }

    // This checks to ensure the new user's role is valid before creation.
    // It is not validating the current user's role.
    if (
      user_role !== 'Admin' &&
      user_role !== 'User' &&
      user_role !== 'Read Only'
    ) {
      console.log('IF TRIGGERED.');
      throw 'Invalid role.';
    }

    if (!existingUser) {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(process.env.TEMP_USER_PW, salt);
      userData.password = passwordHash;
      await createUserInDb(userData);
      //Remove password from userData obj for safety
      delete userData.password;
    }

    const organizationUserData: IOrganizationUser = {
      user_id: userData.id,
      organization_id,
      user_role: user_role as UserRole,
      id: uuidv4()
    };

    const orgUser = await createOrganizationUserInDb(organizationUserData);

    res.status(200).json({
      success: true,
      message: `User created successfully!`,
      data: {
        user: userData,
        organization_user: orgUser
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

export const deleteOrganizationUser = async (req: Request, res: Response) => {
  // const { organization_id, organization_user_id } = req.body;

  const { organizationId, organizationUserId } = req.params;

  const organizationUserData: IOrganizationUser = {
    id: organizationUserId,
    organization_id: organizationId
  };

  try {
    const user = deleteOrganizationUserInDb(
      organizationUserData.id,
      organizationUserData.organization_id
    );

    if (!user) throw 'Error deleting user.';

    return res.status(201).json({
      success: true,
      message: 'User deleted!',
      user
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error
    });
  }
};

export interface CombinedOrgUserAndUser {
  org_user_id: IOrganizationUser['id'];
  organization_id: IOrganizationUser['organization_id'];
  user_id: IOrganizationUser['user_id'];
  user_role: IOrganizationUser['user_role'];
  user_name: IUser['name'];
  user_email: IUser['email'];
}

export const fetchAllOrganizationUsers = async (
  req: Request,
  res: Response
) => {
  // const { organization_id, organization_user_id } = req.body;

  const { organizationId } = req.params;

  try {
    const users = await fetchOrgUsersWithUserJoin(organizationId);
    console.log(users);

    return res.status(201).json({
      success: true,
      message: 'Users fetched!',
      users
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error
    });
  }
};

export const fetchSingleOrganizationUser = async (
  req: Request,
  res: Response
) => {
  // const { organization_id, organization_user_id } = req.body;

  const { organizationId, organizationUserId } = req.params;

  try {
    const user = await fetchSingleOrgUserWithUserJoin(
      organizationUserId,
      organizationId
    );

    return res.status(201).json({
      success: true,
      message: 'User fetched!',
      user
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error
    });
  }
};
