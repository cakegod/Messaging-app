import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import { Strategy as JWTStrategy } from "passport-jwt";
import { UserModel } from "../api/users/users.model";
import { Request } from "express";

const passportConfig = () => {
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            return done(null, false, {
              message: "Incorrect email",
            });
          }

          if (await user.isPasswordValid(password)) {
            return done(null, false, {
              message: "Incorrect password",
            });
          }

          done(null, user);
        } catch (err) {
          done(err);
        }
      },
    ),
  );

  function cookieExtractor(req: Request) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies.token;
    }
    return token;
  }

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET!,
      },
      async (token, done) => {
        const user = await UserModel.findById(token.id);

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      },
    ),
  );
};

export default passportConfig;
