import { RELATIONSHIP_TYPES } from "./users.contants";
import { Document } from "mongoose";
import { User } from "./users.model";

type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];
type UserWithDocument = User & Document;

export type { RelationshipType, UserWithDocument };
