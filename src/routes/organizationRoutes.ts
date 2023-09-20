import { Router } from 'express';
import {
  deleteOrganizationUser,
  createOrganizationUser,
  fetchAllOrganizationUsers,
  fetchSingleOrganizationUser
} from '../controllers/organizationController';
import { ensureRequestBodyHasRequiredFields } from '../services/middleware/ensureRequestBodyHasRequiredFields';
import { userRoleValidator } from '../services/middleware/userRoleValidator';
import { createLedger, deleteLedger } from '../controllers/ledgerController';
import { router as ledgerRouter } from './ledgerRoutes';

export const router = Router({ mergeParams: true });

//ORG USER ENDPOINTS

router.post(
  '/user',
  ensureRequestBodyHasRequiredFields(['user_email', 'user_role']),
  createOrganizationUser
);

router.get('/users', fetchAllOrganizationUsers);

router.get('/user/:organizationUserId', fetchSingleOrganizationUser);

router.delete('/user/:organizationUserId', deleteOrganizationUser);

//ORG LEDGER ENDPOINTS

router.use('/ledger', ledgerRouter);

//router.post('/', userAuth, userRoleValidator(['Admin', 'User']), createLedger);
