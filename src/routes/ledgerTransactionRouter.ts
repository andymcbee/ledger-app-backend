import { Router } from 'express';
import { ensureRequestBodyHasRequiredFields } from '../services/middleware/ensureRequestBodyHasRequiredFields';
import {
  createLedgerTransaction,
  fetchAllLedgerTransactions
} from '../controllers/ledgerTransactionController';

export const router = Router({ mergeParams: true });

router.post('/', createLedgerTransaction);
router.get('/many', fetchAllLedgerTransactions);

//ensure this also creates a history item
//Required fields: amount_cents, transaction_date transaction_type
//FOR DATE:(In UI, default it but allow user to set it)

//Delete a ledger transaction
//router.delete('/:transaction_id', deleteLedgerTransaction);
//ensure this also creates a history item

//Update a ledger transaction
//router.patch('/:transaction_id', updateLedgerTransaction);
//ensure this also creates a history item
// Allow to update amount_cents, description, transaction_date, transaction_type
// required fields: none.. but ensure at least 1
