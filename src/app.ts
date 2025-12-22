import express, { Application, NextFunction, Request, Response, } from 'express';
import cors from "cors";
import { UserRouter } from './app/modules/User/user.routes';
import { AdminRouters } from './app/modules/Admin/admin.routes';
import router from './app/modules/routes';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { error } from 'console';
import path from 'path';
import cookieParser from 'cookie-parser';

export const app: Application = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req:Request, res:Response) => {
  res.send({
    message: 'Server is running successfully',
  });
});

app.use('/api/v1',router);
app.use(globalErrorHandler);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Route not found',
    error: {
      path: req.originalUrl,
      message: 'You have reached a route that is not defined on the server',
    },
  });
});

export default app;