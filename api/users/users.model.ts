import { InferSchemaType, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    displayName: {
      type: String,
      required: false,
      default: function () {
        return (this as User).username;
      },
    },
    friends: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: false,
      default: [],
    },
    sent_requests: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "FriendRequest",
        },
      ],
      required: false,
      default: [],
    },
    received_requests: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "FriendRequest",
        },
      ],
      required: false,
      default: [],
    },
  },
  {
    strict: "throw",
    methods: {
      async isPasswordValid(password) {
        return !(await bcrypt.compare(password, this.password));
      },
    },
  },
);

UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

type User = InferSchemaType<typeof UserSchema>;

const UserModel = model("User", UserSchema);

export { User, UserModel };
