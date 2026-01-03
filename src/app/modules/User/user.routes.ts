import express, { Request, Response } from 'express';
import { UserController } from './user.controller';
import { JwtHelper } from '../../../helper/jwtHelper';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import authenticateUser from '../../middlewares/authenticateUser';
const router = express.Router();



// Define user-related routes here
router.post('/create-admin', authenticateUser('ADMIN', 'SUPER_ADMIN'), UserController.CreateAdmin);
router.post('/', UserController.createUser);
router.get('/all',UserController.getUSerfromDB);

// Change user status (ACTIVE/BLOCKED)
router.patch('/:id/status', authenticateUser('ADMIN', 'SUPER_ADMIN'), UserController.changeUserStatus);

export const UserRouter = router;