export interface IBaseUser {
  name?: string;
  email?: string;
  password?: string;
  created_at?: Date;
}

export interface IUser extends IBaseUser {
  id: string;
}
