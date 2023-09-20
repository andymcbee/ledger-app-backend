export interface IBaseLedgerUser {
  user_id: string;
  ledger_id: string;
  organization_id: string;
  created_at?: Date;
}

export interface ILedgerUser extends IBaseLedgerUser {
  id: string;
}
