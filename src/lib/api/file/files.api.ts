// ─── File Manager API Client ──────────────────────────────────────────────────
// Extends the base APIClient with file-specific operations.
// Constructed with a FileEntityConfigFull + optional overrides so a single
// class handles every entity type without branching.

import { FileEntityConfigFull, buildEndpoints } from "@/config/file/file.entity.config";
import { FileEndpoints } from "@/types/files/config.types";
import { UploadFileResponse, GetFileResponse, GetPublicFileResponse, OptimizedTransformParams, GetOptimizedFileResponse, DeleteFileResponse, GetFileRecordResponse, GetPublicFileRecordResponse, PaginationParams, GetFileHistoryResponse, FileMetadataUpdateBody, UpdateFileMetadataResponse, ArchiveFileResponse, RestoreFileResponse, DeleteFileRecordResponse, FileStatsResponse, CleanupArchivedFilesResponse } from "@/types/files/file.api.types";
import { APIClient } from "../base/api-client";

// ─── Constructor Options ──────────────────────────────────────────────────────

export interface FileManagerAPIOptions {
  // Override the default route prefix defined in the config.
  // Useful when the Express router is mounted at a non-default path.
  routePrefix?: string;

  // Base URL for the API (forwarded to the APIClient constructor).
  // Falls back to NEXT_PUBLIC_API_URL / window.location.origin.
  baseURL?: string;
}

// ─── File Manager API ─────────────────────────────────────────────────────────

export class FileManagerAPI extends APIClient {
  private readonly config: FileEntityConfigFull;
  private readonly routePrefix: string;

  constructor(config: FileEntityConfigFull, options: FileManagerAPIOptions = {}) {
    super(options.baseURL);
    this.config      = config;
    this.routePrefix = options.routePrefix ?? config.defaultRoutePrefix;
  }

  // ── Private: resolve endpoint map for an entityId ────────────────────────

  private endpoints(entityId?: string): FileEndpoints {
    return buildEndpoints(this.config, entityId, this.routePrefix);
  }

  // ── Private: upload via FormData (bypasses JSON Content-Type) ────────────
  // Removes Content-Type from the default headers so the browser sets the
  // correct multipart/form-data boundary automatically.

  private async postFormData<T>(
    endpoint: string,
    formData: FormData,
    onProgress?: (percent: number) => void
  ): Promise<T> {
    const url   = this.buildURL(endpoint);
    const token = this.getAuthToken();

    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    // Use XMLHttpRequest when a progress callback is supplied, otherwise
    // fall back to fetch for a lighter code path.
    if (onProgress) {
      return new Promise<T>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const raw = JSON.parse(xhr.responseText);
              resolve((raw?.data ?? raw) as T);
            } catch {
              reject(new Error("Failed to parse upload response"));
            }
          } else {
            let message = `Upload failed: ${xhr.status}`;
            try {
              const errBody = JSON.parse(xhr.responseText);
              message = errBody?.message ?? message;
            } catch { /* ignore */ }
            reject(new Error(message));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(formData);
      });
    }

    const response = await fetch(url, { method: "POST", headers, body: formData });
    if (!response.ok) await this.handleErrorResponse(response);
    const raw = await response.json();
    return (raw?.data ?? raw) as T;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CLOUDINARY — UPLOAD
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Upload a file for the given entity.
   *
   * Linked mode  — pass entityId; it is stamped on the record immediately.
   * Orphan mode  — omit entityId; the returned fileId must be forwarded to the
   *                entity create/update handler to link the file post-upload.
   */
  async uploadFile(
    file: File,
    entityId?: string,
    extraFields?: Record<string, string>,
    onProgress?: (percent: number) => void
  ): Promise<UploadFileResponse> {
    const ep = this.endpoints(entityId);

    const formData = new FormData();
    formData.append(this.config.uploadFieldName, file);

    if (entityId) formData.append("entityId", entityId);
    if (extraFields) {
      Object.entries(extraFields).forEach(([k, v]) => formData.append(k, v));
    }

    return this.postFormData<UploadFileResponse>(ep.upload, formData, onProgress);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CLOUDINARY — READ
  // ─────────────────────────────────────────────────────────────────────────

  /** Active asset — secure URL + full metadata. Requires auth. */
  async getFile(entityId: string): Promise<GetFileResponse> {
    const ep = this.endpoints(entityId);
    return this.get<GetFileResponse>(ep.getAsset);
  }

  /**
   * Public-safe asset fields — no auth required.
   * Only available on entities with hasPublicAssetRoute = true.
   */
  async getPublicFile(entityId: string): Promise<GetPublicFileResponse> {
    const ep = this.endpoints(entityId);
    if (!ep.getPublicAsset) {
      throw new Error(
        `[FileManagerAPI] getPublicFile is not available for entity type "${this.config.entityType}"`
      );
    }
    return this.get<GetPublicFileResponse>(ep.getPublicAsset);
  }

  /**
   * Optimized Cloudinary transformation URL.
   * Only available on entities with hasOptimizedRoute = true.
   */
  async getOptimizedFile(
    entityId: string,
    params?: OptimizedTransformParams
  ): Promise<GetOptimizedFileResponse> {
    const ep = this.endpoints(entityId);
    if (!ep.getOptimizedAsset) {
      throw new Error(
        `[FileManagerAPI] getOptimizedFile is not available for entity type "${this.config.entityType}"`
      );
    }
    const merged = { ...this.config.defaultTransformParams, ...params };
    return this.get<GetOptimizedFileResponse>(ep.getOptimizedAsset, merged as Record<string, string | number | boolean | undefined>);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CLOUDINARY — DELETE
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Full delete — removes Cloudinary asset, unlinks from entity doc,
   * and hard-deletes the MongoDB record.
   */
  async deleteFile(entityId: string): Promise<DeleteFileResponse> {
    const ep = this.endpoints(entityId);
    return this.delete<DeleteFileResponse>(ep.deleteAsset);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MONGODB — RECORD
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Active MongoDB record — marks lastAccessedAt. Requires auth.
   */
  async getFileRecord(entityId: string): Promise<GetFileRecordResponse> {
    const ep = this.endpoints(entityId);
    return this.get<GetFileRecordResponse>(ep.getRecord);
  }

  /**
   * Public-safe record fields — no auth required.
   * Only available on entities with hasPublicRecordRoute = true.
   */
  async getPublicFileRecord(entityId: string): Promise<GetPublicFileRecordResponse> {
    const ep = this.endpoints(entityId);
    if (!ep.getPublicRecord) {
      throw new Error(
        `[FileManagerAPI] getPublicFileRecord is not available for entity type "${this.config.entityType}"`
      );
    }
    return this.get<GetPublicFileRecordResponse>(ep.getPublicRecord);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MONGODB — HISTORY
  // ─────────────────────────────────────────────────────────────────────────

  /** Paginated list of active + archived records. */
  async getFileHistory(
    entityId: string,
    params?: PaginationParams
  ): Promise<GetFileHistoryResponse> {
    const ep = this.endpoints(entityId);
    return this.get<GetFileHistoryResponse>(ep.getHistory, params);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MONGODB — METADATA
  // ─────────────────────────────────────────────────────────────────────────

  /** Update description and/or tags on the active record. */
  async updateFileMetadata(
    entityId: string,
    body: FileMetadataUpdateBody
  ): Promise<UpdateFileMetadataResponse> {
    const ep = this.endpoints(entityId);
    return this.patch<UpdateFileMetadataResponse>(ep.updateMetadata, body);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MONGODB — ARCHIVE / RESTORE
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Soft-archive the active record.
   * Does NOT touch the Cloudinary asset — use deleteFile for full removal.
   */
  async archiveFile(entityId: string): Promise<ArchiveFileResponse> {
    const ep = this.endpoints(entityId);
    return this.post<ArchiveFileResponse>(ep.archive);
  }

  /**
   * Restore an archived record by its fileId.
   * The currently active record is archived first if one exists.
   */
  async restoreFile(
    entityId: string,
    fileId: string
  ): Promise<RestoreFileResponse> {
    const ep = this.endpoints(entityId);
    return this.post<RestoreFileResponse>(ep.restore(fileId));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MONGODB — DELETE RECORD
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Hard-delete the MongoDB record without touching the Cloudinary asset.
   * For full teardown (asset + record) use deleteFile instead.
   */
  async deleteFileRecord(entityId: string): Promise<DeleteFileRecordResponse> {
    const ep = this.endpoints(entityId);
    return this.delete<DeleteFileRecordResponse>(ep.deleteRecord);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MONGODB — STATS
  // ─────────────────────────────────────────────────────────────────────────

  /** Storage and count statistics across active and archived records. */
  async getFileStats(entityId: string): Promise<FileStatsResponse> {
    const ep = this.endpoints(entityId);
    return this.get<FileStatsResponse>(ep.getStats);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MONGODB — CLEANUP
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Hard-delete archived records older than `daysOld` days (default: 30).
   * MongoDB records only — Cloudinary assets are not touched.
   */
  async cleanupArchivedFiles(
    entityId: string,
    daysOld = 30
  ): Promise<CleanupArchivedFilesResponse> {
    const ep = this.endpoints(entityId);
    return this.delete<CleanupArchivedFilesResponse>(`${ep.cleanup}?daysOld=${daysOld}`);
  }
}