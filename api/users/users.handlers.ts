import { body, validationResult } from "express-validator";
import { Request, Response } from "express";
import { RelationshipModel, UserModel } from "./users.model";
import passport from "passport";
import jwt from "jsonwebtoken";
import { RelationshipType, UserWithDocument } from "./users.types";
import { RELATIONSHIP } from "./users.contants";

const postLogin = [
  passport.authenticate("login", { session: false }),
  (req: Request & { user: UserWithDocument }, res: Response) => {
    res
      .cookie(
        "token",
        jwt.sign(
          {
            username: req.user.username,
            id: req.user.id,
          },
          process.env.JWT_SECRET,
        ),
        { httpOnly: true },
      )
      .end();
  },
];

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
    if (!validationResult(req).isEmpty()) {
      return res.status(400).json({ errors: validationResult(req).array() });
    }

    const user = await UserModel.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
    });

    if (!user) {
      return res.status(400).json("Error! Can't create the user.");
    }

    res.status(200).json(user);
  },
];

async function addRelationship(
  relationshipType: RelationshipType,
  sender: UserWithDocument,
  receiver: UserWithDocument,
) {
  sender.relationships?.push(
    new RelationshipModel({
      type: relationshipType,
      user: receiver,
    }),
  );
  await sender.save();
}

async function addFriendRequest(
  sender: UserWithDocument,
  receiver: UserWithDocument,
) {
  await addRelationship(RELATIONSHIP.PendingOutgoing, sender, receiver);
  await addRelationship(RELATIONSHIP.PendingIncoming, receiver, sender);
}

const postSendFriendRequest = [
  passport.authenticate("jwt", { session: false }),
  async (req: Request & { user: UserWithDocument }, res: Response) => {
    const sender = req.user;

    if (!sender) {
      return res.status(401).end();
    }

    const receiver = await UserModel.findById(req.body.receiver_id).exec();

    if (!receiver) {
      return res.status(404).end();
    }

    await addFriendRequest(sender, receiver);

    res.status(200).end();
  },
];

interface ValidatedRequestWithJWT extends Request {
  user: {
    username: string;
    id: string;
  };
  body: {
    displayName: string;
  };
}

const getCurrentUser = [
  passport.authenticate("jwt", { session: false }),
  (req: ValidatedRequestWithJWT, res: Response) => {
    res.json(req.user);
  },
];

const validateUserProfile = () => [
  body("displayName").exists().isLength({ min: 4, max: 15 }),
];

// TODO add other profile changes
const patchUpdateUser = [
  passport.authenticate("jwt", { session: false }),
  ...validateUserProfile(),
  async (req: ValidatedRequestWithJWT, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      return res.status(400).json({ errors: validationResult(req).array() });
    }

    const update = await UserModel.findByIdAndUpdate(
      req.user.id,
      {
        displayName: req.body.displayName,
      },
      { new: true },
    ).exec();

    return res.json(update);
  },
];

export {
  postRegister,
  postLogin,
  getCurrentUser,
  postSendFriendRequest,
  patchUpdateUser,
};
