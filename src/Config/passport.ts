import { ExtractJwt, Strategy } from "passport-jwt"
import User from "../Models/User";


const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined');
}

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_KEY,
};

export default function (passport: any) {
    passport.use(new Strategy(options, (payload: any, done: any) => {

        User.findOne({ _id: payload.sub })
            .then((user) => {
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            }).catch((err) => {
                return done(err, false)
            });

    }))
}