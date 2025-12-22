import express, { Request, Response } from 'express';
import { AdminController } from './admin.controller';
import {z} from 'zod';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidationSchema } from './admin.validation';

const router = express.Router();






router.get ('/', AdminController.getAllAdminsfromDB);
router.get('/:id',AdminController.getByIdFromDB);
router.patch('/:id', validateRequest(AdminValidationSchema.update),AdminController.updateIntoDB);
router.delete('/:id',AdminController.DeleteFromDB);
router.delete('/soft/:id',AdminController.SoftDeleteFromDB);

export const AdminRouters = router;