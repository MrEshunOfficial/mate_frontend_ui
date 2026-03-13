// types/profiles/userProfile.types.ts

import type { BaseEntity, SoftDeletable, UserRole } from "../base.types";

// ─── Base Profile ─────────────────────────────────────────────────────────────

export interface IUserProfile extends BaseEntity, SoftDeletable {
  userId: string; // ObjectId → string
  role: UserRole;
  bio?: string;
  mobileNumber?: string;
  profilePictureId?: string; // ObjectId → string
}

// ─── Domain Profile Link ──────────────────────────────────────────────────────

// Mirrors the backend DomainProfile — the bridge between IUserProfile and the
// role-specific document (ClientProfile | ProviderProfile).
// One record per role the user has ever held; only one is active at a time.
export interface DomainProfile extends BaseEntity, SoftDeletable {
  userId: string;      // ObjectId → string
  profileId: string;   // → ClientProfile._id or ProviderProfile._id
  role: UserRole;
  isActive: boolean;
  activatedAt?: Date;
  deactivatedAt?: Date;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export type CreateProfileRequestBody = Omit<
    IUserProfile,
    | "_id"
    | "userId"
    | "createdAt"
    | "updatedAt"
    | "isDeleted"
    | "deletedAt"
    | "deletedBy"
  >

export type UpdateProfileRequestBody = Partial<
    Omit<
      IUserProfile,
      | "_id"
      | "userId"
      | "role"      // role is immutable after creation
      | "createdAt"
      | "updatedAt"
      | "isDeleted"
      | "deletedAt"
      | "deletedBy"
    >
  >

// ─── Response Types ───────────────────────────────────────────────────────────

export interface ProfileResponse {
  success: boolean;
  message: string;
  profile?: Partial<IUserProfile>;
  error?: string;
}