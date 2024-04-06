import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
        if (err || !user) {
            return res.status(401).json({
                message: 'Unauthorized',
                error: info ? info.message : 'Unknown error',
            });
        }
        req.user = user;
        next();
    })(req, res, next);
};

export { authenticate };