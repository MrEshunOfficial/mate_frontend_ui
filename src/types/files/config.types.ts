// ─── File Entity Route Config ─────────────────────────────────────────────────
// Describes how each entity type's file routes are shaped.
// The API class and hook consume this config to build correct URLs and
// know which operations are available for a given entity.

import { OptimizedTransformParams } from "./file.api.types";
import { FileEntityType, ImageLabel } from "./files.types";


// ─── Upload Mode ──────────────────────────────────────────────────────────────

export type UploadMode = "linked" | "orphan";

// ─── Access Level ─────────────────────────────────────────────────────────────
// Marks which read operations on this entity type allow unauthenticated access.

export interface AccessLevel {
  getAsset: "public" | "private";
  getOptimized: "public" | "private";
  getRecord: "public" | "private";
}

// ─── Entity-Level File Config ─────────────────────────────────────────────────
// One config object per entity type. Drives URL construction and
// capability flags throughout the API client and hooks.

export interface FileEntityConfig {
  // ── Identity ───────────────────────────────────────────────────────────────

  entityType: FileEntityType;
  label: ImageLabel;

  // ── Upload ─────────────────────────────────────────────────────────────────

  uploadMode: UploadMode;

  // The multipart field name expected by the backend multer middleware.
  // Cloudinary upload routes use either "file" or "image" depending on entity.
  uploadFieldName: "file" | "image";

  // ── URL segments ──────────────────────────────────────────────────────────
  //
  // uploadPath    — POST path for the upload endpoint (no entityId in URL).
  //                 e.g. "/cloudinary/client-id-image"
  //
  // entitySegment — the URL segment before the entityId param.
  //                 e.g. "clients", "providers", "tasks", "bookings"
  //
  // assetSegment  — the URL segment after the entityId param that identifies
  //                 the file type.
  //                 e.g. "id-image", "gallery", "attachments", "cover"
  //
  // cloudinaryPrefix — prefix for Cloudinary asset routes.
  //                    e.g. "/cloudinary" (most entities),
  //                         "/cloudinary/:entityId/cover" (service/category)
  //
  // entityIdParam — name of the URL param used to identify the owning entity.
  //                 e.g. "clientProfileId", "providerProfileId", "taskId"

  uploadPath: string;
  entitySegment: string;
  assetSegment: string;
  cloudinaryPrefix: string;
  entityIdParam: string;

  // ── Capability flags ───────────────────────────────────────────────────────

  hasOptimizedRoute: boolean;
  hasPublicAssetRoute: boolean;
  hasPublicRecordRoute: boolean;

  // ── Access ─────────────────────────────────────────────────────────────────

  access: AccessLevel;

  // ── Default optimized transform params ────────────────────────────────────

  defaultTransformParams?: OptimizedTransformParams;
}

// ─── Resolved Endpoint Map ────────────────────────────────────────────────────
// Computed from FileEntityConfig at runtime for a specific entityId.
// Consumed by the API client methods.

export interface FileEndpoints {
  // Cloudinary
  upload: string;
  getAsset: string;
  getPublicAsset?: string;
  getOptimizedAsset?: string;
  deleteAsset: string;

  // MongoDB record
  getRecord: string;
  getPublicRecord?: string;
  getHistory: string;
  updateMetadata: string;
  archive: string;
  restore: (fileId: string) => string;
  deleteRecord: string;
  getStats: string;
  cleanup: string;
}

// ─── Per-Entity Config Registry ───────────────────────────────────────────────
// The full config map, keyed by FileEntityType.
// Populated in file-entity-configs.ts and consumed by the API class.

export type FileEntityConfigRegistry = Partial<
  Record<FileEntityType, FileEntityConfig>
>;