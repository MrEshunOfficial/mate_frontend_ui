// ─── File API — Request & Response Interfaces ─────────────────────────────────
// One canonical set of shapes covering all entity types and operations.
// All response types wrap the backend's { data: ... } envelope.

import { IFilePublic, IFileRecord } from "./files.types";

// ─── Shared Pagination ────────────────────────────────────────────────────────

export interface PaginationParams {
  limit?: number;
  skip?: number;
}

// ─── Optimized Transform Params ───────────────────────────────────────────────

export interface OptimizedTransformParams {
  width?: number;
  quality?: number | "auto";
  format?: "auto" | "webp" | "jpg" | "png";
}

// ─── Metadata Update ──────────────────────────────────────────────────────────

export interface FileMetadataUpdateBody {
  description?: string;
  tags?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// CLOUDINARY RESPONSE SHAPES
// ─────────────────────────────────────────────────────────────────────────────

// POST upload → returns the new file record
export interface UploadFileResponse {
  file: IFileRecord;
  fileId: string;
  message?: string;
}

// GET active asset → secure URL + light metadata
export interface GetFileResponse {
  file: IFileRecord;
}

// GET /public → only public-safe fields
export interface GetPublicFileResponse {
  file: IFilePublic;
}

// GET /optimized → transformation URL only
export interface GetOptimizedFileResponse {
  url: string;
  transformations?: {
    width?: number;
    quality?: number | "auto";
    format?: string;
  };
}

// DELETE full → confirms asset + record removal
export interface DeleteFileResponse {
  deleted: boolean;
  fileId: string;
  message?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MONGODB RECORD RESPONSE SHAPES
// ─────────────────────────────────────────────────────────────────────────────

// GET /record → full record, marks lastAccessedAt
export interface GetFileRecordResponse {
  file: IFileRecord;
}

// GET /record/public → public-safe record fields
export interface GetPublicFileRecordResponse {
  file: IFilePublic;
}

// GET /history → paginated list of active + archived records
export interface GetFileHistoryResponse {
  files: IFileRecord[];
  total: number;
  active: number;
  archived: number;
}

// PATCH /metadata → returns updated record
export interface UpdateFileMetadataResponse {
  file: IFileRecord;
  message?: string;
}

// POST /archive → confirms archival
export interface ArchiveFileResponse {
  archived: boolean;
  fileId: string;
  message?: string;
}

// POST /restore/:fileId → returns restored record
export interface RestoreFileResponse {
  file: IFileRecord;
  previouslyActiveFileId?: string;
  message?: string;
}

// DELETE /db → confirms hard-delete of record
export interface DeleteFileRecordResponse {
  deleted: boolean;
  fileId: string;
  message?: string;
}

// GET /stats → storage summary
export interface FileStatsResponse {
  totalFiles: number;
  activeFiles: number;
  archivedFiles: number;
  totalStorageBytes: number;
  averageFileSizeBytes: number;
}

// DELETE /cleanup → confirms purge of old archives
export interface CleanupArchivedFilesResponse {
  deletedCount: number;
  freedBytes: number;
  message?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// UPLOAD REQUEST SHAPES
// ─────────────────────────────────────────────────────────────────────────────

// Multipart form data fields that accompany the binary file upload.
// entityId is optional — omitted in orphan-mode uploads.
export interface UploadFileBody {
  entityId?: string;
  description?: string;
  tags?: string;            // JSON-stringified string[] or comma-separated
}

// Used by entity create/update handlers to pass a previously-uploaded fileId.
// The backend links the orphan file to the entity on receipt.
export interface LinkOrphanFileBody {
  fileId: string;
}