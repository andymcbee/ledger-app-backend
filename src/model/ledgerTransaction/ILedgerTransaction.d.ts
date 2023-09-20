import { TransactionType } from '../../types/TransactionType';

export interface IBaseLedgerTransaction {
  ledger_id?: string;
  organization_id: string;
  amount_cents?: number;
  description?: string;
  transaction_date?: Date;
  transaction_type?: TransactionType;
  created_at?: Date;
}

export interface ILedgerTransaction extends IBaseLedgerTransaction {
  id: string;
}
