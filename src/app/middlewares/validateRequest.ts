import { NextFunction, Request, Response } from "express";
import z from "zod";


const validateRequest = (schema:z.ZodTypeAny) => async (req:Request, res:Response, next:NextFunction) => {
    try{
        await schema.parseAsync(req.body);
         return next();
    }catch (err){
        next(err);
    }
}


export default validateRequest;