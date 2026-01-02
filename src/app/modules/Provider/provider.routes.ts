import express from 'express';
import { ProviderController } from './provider.controller';
import authenticateUser from '../../middlewares/authenticateUser';

const router = express.Router();

// Create provider (Admin/Super Admin only)
router.post(
  '/create-provider',
  authenticateUser('ADMIN', 'SUPER_ADMIN'),
  ProviderController.createProvider
);

// Get all providers
router.get('/', ProviderController.getAllProviders);

// Get provider by ID
router.get('/:id', ProviderController.getProviderById);

// Update provider (Admin/Super Admin/Provider themselves)
router.patch(
  '/:id',
  authenticateUser('ADMIN', 'SUPER_ADMIN', 'PROVIDER'),
  ProviderController.updateProvider
);

// Delete provider (Admin/Super Admin only)
router.delete(
  '/:id',
  authenticateUser('ADMIN', 'SUPER_ADMIN'),
  ProviderController.deleteProvider
);

export const ProviderRoutes = router;
