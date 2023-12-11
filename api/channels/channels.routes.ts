import express from "express";
import { getAllChannels, getChannel, getMessages } from "./channels.handlers";

const router = express.Router();

router.get("/", getAllChannels);
router.get("/:channel_id", getChannel);
router.get("/:channel_id/messages", getMessages);

export default router;
