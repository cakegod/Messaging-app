import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { UserModel } from "../api/users/users.model";

const passportConfig = () => {
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username });

          if (!user) {
            return done(null, false, {
              message: "Incorrect username",
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

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
