import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false });
    next();
}