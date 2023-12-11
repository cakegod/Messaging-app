import { ChannelModel } from "./channels.model";
import { Request, Response } from "express";
import { MessageModel } from "../messages/messages.model";

const getAllChannels = async (req: Request, res: Response) => {
  const channels = await ChannelModel.find().exec();

  return res.json(channels);
};

const getChannel = async (req: Request, res: Response) => {
  const channel = await ChannelModel.findById(req.params.channel_id).exec();

  if (!channel) {
    return res.status(404).end();
  }

  return res.json(channel);
};

const getMessages = async (req: Request, res: Response) => {
  const messages = await MessageModel.find({
    channel_id: req.params.channel_id,
  }).exec();

  if (!messages) {
    return res.status(404).end();
  }

  return res.json(messages);
};

export { getAllChannels, getChannel, getMessages };
