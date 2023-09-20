import { Router } from 'express';
import { createOrganization } from '../controllers/organizationCreationController';
import { ensureRequestBodyHasRequiredFields } from '../services/middleware/ensureRequestBodyHasRequiredFields';

export const router = Router();

router.post(
  '/',
  ensureRequestBodyHasRequiredFields(['user_email', 'user_password']),
  createOrganization
);
