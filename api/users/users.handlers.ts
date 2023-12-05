import { body, validationResult } from "express-validator";
import { Request, Response } from "express";
import { UserModel } from "./users.model";

function postLogin() {}

const validateUser = () => [
  body("email").isEmail().trim().escape(),
  body("username").exists().escape().trim(),
  body("password").exists(),
  body(
    "passwordConfirm",
    "Both password and confirm password must be equal",
  ).custom((value, { req }) => value === req.body.password),
];

const postRegister = [
  ...validateUser(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username } = req.body;

    const user = await UserModel.create({ email, password, username });

    res.status(200).end();
  },
];

export { postRegister, postLogin };
