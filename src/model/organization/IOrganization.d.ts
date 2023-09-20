export interface IBaseOrganization {
  name?: string;
  created_at?: Date;
}

export interface IOrganization extends IBaseOrganization {
  id: string;
}
