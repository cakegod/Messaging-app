import { ChannelModel } from "./channels.model";
import { Request, Response } from "express";

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

export { getAllChannels, getChannel };
