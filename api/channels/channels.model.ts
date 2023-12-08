import { InferSchemaType, model, Schema } from "mongoose";

const ChannelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

type Channel = InferSchemaType<typeof ChannelSchema>;

const ChannelModel = model("Channel", ChannelSchema);

export { ChannelSchema, Channel, ChannelModel };
