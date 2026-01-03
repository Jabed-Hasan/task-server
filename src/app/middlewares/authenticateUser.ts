import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import { JwtHelper } from "../../helper/jwtHelper";
import config from "../../config";
import AppDataSource from "../../config/database";
import { User } from "../../entities/User.entity";

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
    
    // Fetch full user details from database
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { email: verifiedUser.email }
    });
    
    // Attach user info to request
    (req as any).user = {
      id: user?.id,
      email: verifiedUser.email,
      name: user?.name || verifiedUser.email.split('@')[0],
      role: verifiedUser.role
    };
    
    next();
    
 
}catch (err) {
      next(err)
   }
}

}


export  default authenticateUser;