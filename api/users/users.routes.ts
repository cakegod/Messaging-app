import express from "express";
import { postLogin, postRegister, getCurrentUser } from "./users.handlers";

const router = express.Router();

router.post("/login", postLogin);
router.post("/register", postRegister);
router.get("/users/@me", getCurrentUser);
// router.post("/user/:id", postSendFriendRequest);

export default router;
