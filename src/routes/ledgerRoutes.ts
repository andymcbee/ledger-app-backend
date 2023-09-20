import { Router } from 'express';
import { ensureRequestBodyHasRequiredFields } from '../services/middleware/ensureRequestBodyHasRequiredFields';
import {
  createLedger,
  deleteLedger,
  fetchOrgLedgers
} from '../controllers/ledgerController';
import { router as ledgerTransactionRouter } from './ledgerTransactionRouter';

export const router = Router({ mergeParams: true });

router.post('/', createLedger);
router.delete('/:ledger_id', deleteLedger);
router.get('/many', fetchOrgLedgers); //accepts query paramaters for offset and limit. eg: api.com/limit=5&offset=10
//LEDGER TRANSACTION ENDPOINTS

router.use('/:ledger_id/transaction', ledgerTransactionRouter);
