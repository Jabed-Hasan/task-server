import express, { Request, Response } from 'express';
import { UserController } from './user.controller';
import { JwtHelper } from '../../../helper/jwtHelper';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import authenticateUser from '../../middlewares/authenticateUser';
const router = express.Router();



// Define user-related routes here
router.get('/', UserController.CreateAdmin);
router.post('/', authenticateUser('ADMIN', "SUPER_ADMIN"), UserController.CreateAdmin);
router.get('/all',UserController.getUSerfromDB);
export const UserRouter = router;