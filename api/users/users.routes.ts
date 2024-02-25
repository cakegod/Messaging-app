import express from "express";
import {
  getCurrentUser,
  postLogin,
  postRegister,
  postSendFriendRequest,
  patchUpdateUser,
} from "./users.handlers";

const router = express.Router();

router.post("/login", postLogin);
router.post("/register", postRegister);
router.get("/@me", getCurrentUser);
router.patch("/@me", patchUpdateUser);
router.post("/@me/relationships", postSendFriendRequest);

export default router;
