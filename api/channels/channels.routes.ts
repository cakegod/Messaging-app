import express from "express";
import { getAllChannels, getChannel } from "./channels.handlers";

const router = express.Router();

router.get("/", getAllChannels);
router.get("/:channel_id", getChannel);

export default router;
