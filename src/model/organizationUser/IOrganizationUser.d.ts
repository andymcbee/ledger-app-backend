import { UserRole } from '../../types/UserRole';

export interface IBaseOrganizationUser {
  user_id?: string;
  organization_id?: string;
  user_role?: UserRole;
  created_at?: Date;
}

export interface IOrganizationUser extends IBaseOrganizationUser {
  id: string;
}
