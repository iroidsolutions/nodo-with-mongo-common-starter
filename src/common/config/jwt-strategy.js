import passport from "passport";
import { JWT } from "../constants/constant"
import User from "../../../model/user";
import { ExtractJwt, Strategy as JWTstratagy } from "passport-jwt"

const options = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : JWT.SECRET,
};

passport.use(
    new JWTstratagy(options, async(jwtPayload, done) =>{
        try {
           const user = await User.findOne({
            _id : jwtPayload.id,
           });
           if(!user){
            return done(null,false);
           }
           delete user._doc.password;
           return done(null,{...user._doc, jti : jwtPayload.jti});
        } catch (error) {
           console.log(error);
           return done(error,false) 
        }
    })
)