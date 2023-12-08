import { InferSchemaType, model, Schema } from "mongoose";

const MessageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  channel_id: {
    ref: "Channel",
    type: Schema.Types.ObjectId,
    required: true,
  },
  author: {
    ref: "User",
    type: Schema.Types.ObjectId,
    required: true,
  },
});

type Message = InferSchemaType<typeof MessageSchema>;

const MessageModel = model("Message", MessageSchema);

export { MessageSchema, Message, MessageModel };
