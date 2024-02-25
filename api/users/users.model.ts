import { InferSchemaType, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { RELATIONSHIP } from "./users.contants";

const RelationshipSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: Object.values(RELATIONSHIP),
  },
  user: {
    ref: "User",
    type: Schema.Types.ObjectId,
    required: true,
  },
});

type Relationship = InferSchemaType<typeof RelationshipSchema>;

const RelationshipModel = model("Relationship", RelationshipSchema);

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
    relationships: {
      type: [RelationshipSchema],
      required: true,
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

export { User, UserModel, Relationship, RelationshipModel };
