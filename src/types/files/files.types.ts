// ─── File Entity Interfaces ───────────────────────────────────────────────────
// Mirrors backend IFile + FileEntityType. Used as the canonical shape for any
// file record returned from the API, regardless of entity type.

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum FileEntityType {
  USER             = "user",
  CLIENT_PROFILE   = "client_profile",
  PROVIDER_PROFILE = "provider_profile",
  SERVICE          = "service",
  CATEGORY         = "category",
  BOOKING          = "booking",
  TASK             = "task",
}

export type FileStatus = "active" | "archived";

export type StorageProvider = "local" | "s3" | "cloudinary" | "gcs" | "mega";

export type ImageLabel =
  | "profile_picture"
  | "category_cover"
  | "service_cover"
  | "provider_gallery"
  | "provider_id_image"
  | "client_id_image"
  | "task_image";

// ─── Core File Record ─────────────────────────────────────────────────────────

export interface IFile {
  _id: string;
  uploaderId?: string;

  url: string;
  fileName: string;
  extension?: string;
  thumbnailUrl?: string;
  fileSize?: number;
  mimeType?: string;
  storageProvider: StorageProvider;

  metadata?: Record<string, unknown>;
  tags?: string[];
  description?: string;

  entityType?: FileEntityType;
  entityId?: string;
  label?: ImageLabel;

  status: FileStatus;
  lastAccessedAt?: string;
  uploadedAt: string;
  deletedAt?: string;
}

// ─── Public-Safe Projection ───────────────────────────────────────────────────
// Returned by /public and /record/public endpoints — no secure URLs or PII.

export interface IFilePublic {
  _id: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  label?: ImageLabel;
  tags?: string[];
  description?: string;
}

// ─── Cloudinary Metadata ──────────────────────────────────────────────────────
// Additional fields present on Cloudinary-backed records.

export interface ICloudinaryMeta {
  publicId?: string;
  secureUrl?: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  assetId?: string;
}

// ─── Full File Record (Cloudinary) ────────────────────────────────────────────

export interface IFileRecord extends IFile {
  cloudinary?: ICloudinaryMeta;
}