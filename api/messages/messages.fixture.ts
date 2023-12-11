import { Message, MessageModel } from "./messages.model";
import { channelsFixture } from "../channels/channels.fixture";
import { usersFixture } from "../users/users.fixture";

const firstChannelID = channelsFixture[0]?.id;

const data = [
  {
    channel_id: firstChannelID,
    author: usersFixture[0]?.id,
    content: "Hello TOP!",
  },
  {
    channel_id: firstChannelID,
    author: usersFixture[1]?.id,
    content: "Hey odinite, how's it going?",
  },
  {
    channel_id: firstChannelID,
    author: usersFixture[0]?.id,
    content: "I'm good, and you?",
  },
] as const satisfies readonly Message[];

const firstChannelMessagesFixture = data.map((user) => new MessageModel(user))!;

export { firstChannelMessagesFixture, firstChannelID };
