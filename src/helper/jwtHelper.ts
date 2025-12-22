import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const genererateToken = (payload: any, secret: Secret, expiresIn: string) => {
    const token =  jwt.sign(
        payload, 
        secret,
        { expiresIn }
    );
    return token;
}

const verifyToken = (token: string, secret: Secret) =>{
    return jwt.verify(token, secret) as JwtPayload;
}
    

export const JwtHelper = {
    genererateToken,
    verifyToken,
};