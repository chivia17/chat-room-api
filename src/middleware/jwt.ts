import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

interface TokenData {
    id: number,
    nickname: string
}

/**
 * Verify JWT token
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.  
 * @param {NextFunction} next - The express next function.
 * @returns {function} - Throw error if token is not present or invalid.
 */
export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        if (!('jwt-token' in req.headers)) {
            throw 'The jwt header is not present';
        }

        const tokenValue = req.headers['jwt-token'] as string;

        // verify throws an error if the token is valid, so we can safely continue without checking the returned value
        // The exception handling must be done in the code that called this fucntion.
        const token = jwt.verify(tokenValue, process.env.JWT_SECRET as string) as TokenData;

        const user = await User.findOne({
            'where': {
                'id': token.id,
                'nickname': token.nickname
            }
        });
        
        if(!user) {
            throw 'Unknown user';
        }

        next();
    } catch(error) {
        console.error('JWT middleware:', error);
        return res.status(401).send();
    }
}