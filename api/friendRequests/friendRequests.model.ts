import { InferSchemaType, model, Schema } from "mongoose";

const FriendRequestSchema = new Schema(
  {
    status: {
      type: String,
      required: false,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    requester: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    requestee: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    strict: "throw",
  },
);

type FriendRequest = InferSchemaType<typeof FriendRequestSchema>;

const FriendRequestModel = model("FriendRequest", FriendRequestSchema);

export { FriendRequest, FriendRequestModel };
