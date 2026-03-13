// types/base.types.ts

// ─── Core Entity Shapes ────────────────────────────────────────────────────────

export interface BaseEntity {
  _id: string; // ObjectId serialised to string over the wire
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeletable {
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string; // ObjectId → string
}

// ─── Actor ────────────────────────────────────────────────────────────────────

export enum ActorRole {
  CUSTOMER = "customer",
  PROVIDER = "provider",
  ADMIN    = "admin",
  SYSTEM   = "system",
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export interface SocialMediaHandle {
  nameOfSocial: string;
  userName: string;
  profileUrl?: string;
}

export interface ContactDetails {
  primaryContact: string;
  secondaryContact?: string;
  businessContact?: string;
  businessEmail?: string;
}

// ─── Identity ─────────────────────────────────────────────────────────────────

export enum IdType {
  NATIONAL_ID     = "national_id",
  PASSPORT        = "passport",
  VOTERS_ID       = "voters_id",
  DRIVERS_LICENSE = "drivers_license",
  NHIS            = "nhis",
  OTHER           = "other",
}

export interface IdDetails {
  idType: IdType;
  idNumber: string;
  fileImageId: string[]; // ObjectId[] → string[]
}

// ─── Auth & Roles ─────────────────────────────────────────────────────────────

export enum UserRole {
  CUSTOMER = "customer",
  PROVIDER = "service_provider",
}

export enum SystemRole {
  USER        = "user",
  ADMIN       = "admin",
  SUPER_ADMIN = "super_admin",
}

export enum AuthProvider {
  CREDENTIALS = "credentials",
  GOOGLE      = "google",
  APPLE       = "apple",
  GITHUB      = "github",
  FACEBOOK    = "facebook",
}

// ─── Service Lifecycle ────────────────────────────────────────────────────────

export enum ServiceStatus {
  PENDING_APPROVAL = "pending-approval",
  APPROVED         = "approved",
  REJECTED         = "rejected",
  SUSPENDED        = "suspended",
}

export enum PopulationLevel {
  NONE     = "none",
  MINIMAL  = "minimal",
  STANDARD = "standard",
  DETAILED = "detailed",
}