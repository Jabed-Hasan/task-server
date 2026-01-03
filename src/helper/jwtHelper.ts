import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

const genererateToken = (payload: any, secret: Secret, expiresIn: string | number): string => {
    const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);
    return token;
}

const verifyToken = (token: string, secret: Secret) =>{
    return jwt.verify(token, secret) as JwtPayload;
}
    

export const JwtHelper = {
    genererateToken,
    verifyToken,
};