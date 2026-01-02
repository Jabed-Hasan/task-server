import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import { JwtHelper } from "../../helper/jwtHelper";
import config from "../../config";

const authenticateUser =(...roles:string[]) =>{ 
    return async (req: Request, res: Response, next: NextFunction) => {
   try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('No token provided, Unauthorized!');
    }
    
    // Extract token (remove 'Bearer ' prefix if present)
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;
    
    const verifiedUser = await JwtHelper.verifyToken(token, config.jwt.jwt_secret as Secret);
    if(roles.length && !roles.includes(verifiedUser.role)){
        throw new Error('Forbidden: You do not have access to this resource');
    }
    next();
    
 
}catch (err) {
      next(err)
   }
}

}


export  default authenticateUser;