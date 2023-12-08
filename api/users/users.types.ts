import { RELATIONSHIP } from "./users.contants";
import { Document } from "mongoose";
import { User } from "./users.model";

type RelationshipType = (typeof RELATIONSHIP)[keyof typeof RELATIONSHIP];
type UserWithDocument = User & Document;

export type { RelationshipType, UserWithDocument };
