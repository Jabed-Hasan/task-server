import {  Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";



const refreshToken = catchAsync(async (req:Request, res:Response) => {
       
       const {refreshToken} = req.cookies;

       const result = await AuthService.refreshToken(refreshToken);

       sendResponse(res, {
        statusCode: 200,
        success: true,  
        message: 'User logged in successfully',
        data: result
        // data: {
        //     accessToken: result.accessToken,
        //     needPasswordChange: result.needPasswordChange
        // },
       });
});

const loginUser = catchAsync(async (req:Request, res:Response) => {
       const result = await AuthService.loginUser(req.body);

       const { accessToken, refreshToken} = result;

       res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true,
       });

       sendResponse(res, {
        statusCode: 200,
        success: true,  
        message: 'User logged in successfully',
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange
        },
       });
});


export const AuthController = {
    loginUser,
    refreshToken,
};