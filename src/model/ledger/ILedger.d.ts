export interface IBaseLedger {
  name?: string;
  organization_id: string;
  created_at?: Date;
}

export interface ILedger extends IBaseLedger {
  id: string;
}
