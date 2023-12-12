import express from "express";
import {
  getCurrentUser,
  postLogin,
  postRegister,
  postSendFriendRequest,
  updateUser,
} from "./users.handlers";

const router = express.Router();

router.post("/login", postLogin);
router.post("/register", postRegister);
router.get("/@me", getCurrentUser);
router.patch("/@me", updateUser);
router.post("/@me/relationships", postSendFriendRequest);

export default router;
