import { body, validationResult } from "express-validator";
import { Request, Response } from "express";
import { RelationshipModel, User, UserModel } from "./users.model";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import { RelationshipType, UserWithDocument } from "./users.types";
import { RELATIONSHIP } from "./users.contants";

const postLogin = [
  passport.authenticate("login", { session: false }),
  (req: Request & { user: User & Document }, res: Response) => {
    res
      .cookie(
        "token",
        jwt.sign(
          {
            username: req.user.username,
            // @ts-ignore
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

    const { email, password, username } = req.body;

    const user = await UserModel.create({ email, password, username });

    if (!user) {
      return res.status(400).json("Error! Can't create the user.");
    }

    res.status(200).json(user);
  },
];

async function addRelationship(
  relationshipType: RelationshipType,
  requester: UserWithDocument,
  requestee: UserWithDocument,
) {
  requester.relationships?.push(
    new RelationshipModel({
      type: relationshipType,
      user: requestee,
    }),
  );
  await requester.save();
}

async function addFriendRequest(
  requester: UserWithDocument,
  requestee: UserWithDocument,
) {
  await addRelationship(RELATIONSHIP.PendingOutgoing, requester, requestee);
  await addRelationship(RELATIONSHIP.PendingIncoming, requestee, requester);
}

const postSendFriendRequest = [
  passport.authenticate("jwt", { session: false }),
  async (req: Request & { user: UserWithDocument }, res: Response) => {
    const requester = req.user;

    if (!requester) {
      return res.status(401).end();
    }

    const requestee = await UserModel.findById(req.body.receiver_id).exec();

    if (!requestee) {
      return res.status(404).end();
    }

    await addFriendRequest(requester, requestee);

    res.status(200).end();
  },
];

interface RequestWithJWT extends Request {
  user: {
    username: string;
    id: string;
  };
}

const getCurrentUser = [
  passport.authenticate("jwt", { session: false }),
  (req: RequestWithJWT, res: Response) => {
    res.json(req.user);
  },
];

const validateUserProfile = () => [
  body("displayName").exists().isLength({ min: 4, max: 15 }),
];

// TODO add other profile changes
const updateUser = [
  passport.authenticate("jwt", { session: false }),
  ...validateUserProfile(),
  async (req: RequestWithJWT, res: Response) => {
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
  updateUser,
};
