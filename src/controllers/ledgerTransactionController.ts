import { Request, Response } from 'express';
import { createLedgerTransaction as createLedgerTransactionInDb } from '../model/ledgerTransaction/createLedgerTransaction';
import { deleteLedgerTransaction as deleteLedgerTransactionInDb } from '../model/ledgerTransaction/deleteLedgerTransaction';
import { v4 as uuidv4 } from 'uuid';
import { ILedgerTransaction } from '../model/ledgerTransaction/ILedgerTransaction';
import { fetchLedgerTransactions } from '../model/ledgerTransaction/fetchLedgerTransactions';

//willneed: create, delete, update, fetch all
export const createLedgerTransaction = async (req: Request, res: Response) => {
  const { amount_cents, description, transaction_date, transaction_type } =
    req.body;
  const { organizationId: organization_id, ledger_id } = req.params;

  if (amount_cents < 0)
    throw 'Error, negative numbers cannot be provided. Use Transaction type to describe type.';

  let transaction_amount;

  if (transaction_type === 'credit') {
    transaction_amount = -amount_cents;
  } else if (transaction_type === 'debit') {
    transaction_amount = amount_cents;
  } else {
    throw 'An error has occurred.'; // Vague error on purpose. This means a type was not supplied.
  }

  try {
    const ledgerTransactionData: ILedgerTransaction = {
      ledger_id,
      organization_id,
      id: uuidv4(),
      amount_cents: transaction_amount,
      description,
      transaction_date,
      transaction_type
    };

    const ledgerTransaction = await createLedgerTransactionInDb(
      ledgerTransactionData
    );

    return res.status(201).json({
      success: true,
      message: 'New ledger transaction created!',
      ledger_transaction: ledgerTransaction
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error
    });
  }
};

export const deleteLedgerTransaction = async (req: Request, res: Response) => {
  const { organizationId: organization_id, transaction_id } = req.params;

  try {
    const ledgerTransactionData: ILedgerTransaction = {
      organization_id,
      id: transaction_id
    };

    const ledgerTransaction = await deleteLedgerTransactionInDb(
      ledgerTransactionData
    );

    return res.status(201).json({
      success: true,
      message: `Transaction ${ledgerTransaction.id} deleted!`
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error
    });
  }
};

export const fetchAllLedgerTransactions = async (
  req: Request,
  res: Response
) => {
  const { organizationId: organization_id, ledger_id } = req.params;

  try {
    const transactions = await fetchLedgerTransactions(
      ledger_id,
      organization_id
    );
    console.log(transactions);

    return res.status(201).json({
      success: true,
      message: 'Transactions fetched!',
      transactions
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error
    });
  }
};
