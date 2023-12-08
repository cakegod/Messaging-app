import { Channel, ChannelModel } from "./channels.model";

const data = [
  {
    name: "channelOne",
    description: "hey!",
  },
  {
    name: "channelOne",
    description: "HEYO!",
  },
  {
    name: "channelOne",
    description: "U there?!",
  },
] as const satisfies readonly Channel[];

const channelsFixture = data.map((channel) => new ChannelModel(channel))!;

export { channelsFixture };
