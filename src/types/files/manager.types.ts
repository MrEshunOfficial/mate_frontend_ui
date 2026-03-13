// ─── File Manager Hook — State & Action Interfaces ───────────────────────────
// Defines what the useFileManager hook exposes to consuming components.
// Keeps UI logic decoupled from API details.

import { UploadFileResponse, GetFileResponse, GetPublicFileResponse, GetOptimizedFileResponse, OptimizedTransformParams, DeleteFileResponse, GetFileRecordResponse, GetPublicFileRecordResponse, GetFileHistoryResponse, PaginationParams, FileStatsResponse, UpdateFileMetadataResponse, FileMetadataUpdateBody, ArchiveFileResponse, RestoreFileResponse, DeleteFileRecordResponse, CleanupArchivedFilesResponse } from "./file.api.types";
import { FileEntityType } from "./files.types";

// ─── Operation State ──────────────────────────────────────────────────────────
// Generic async-operation state. Each individual operation on the hook
// carries its own loading/error/data tuple so components can render
// granular loading and error states without coupling.

export interface OperationState<T = unknown> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ─── Hook Config ──────────────────────────────────────────────────────────────
// Passed when calling the hook. entityId can be omitted for orphan-mode
// uploads where the entity doesn't exist yet.

export interface UseFileManagerConfig {
  entityType: FileEntityType;
  entityId?: string;
  autoFetch?: boolean;          // fetch active file on mount (default: false)
  autoFetchRecord?: boolean;    // also fetch the full record on mount
}

// ─── Derived Upload State ─────────────────────────────────────────────────────

export interface UploadState {
  uploading: boolean;
  progress: number;             // 0–100, driven by XHR onprogress if used
  error: string | null;
  uploadedFileId: string | null;
}

// ─── Hook Return Value ────────────────────────────────────────────────────────

export interface UseFileManagerReturn {
  // ── Upload ─────────────────────────────────────────────────────────────────

  upload: OperationState<UploadFileResponse> & {
    progress: number;
    execute: (file: File, extraBody?: Record<string, string>) => Promise<UploadFileResponse | null>;
  };

  // ── Cloudinary asset operations ────────────────────────────────────────────

  asset: OperationState<GetFileResponse> & {
    fetch: () => Promise<void>;
  };

  publicAsset: OperationState<GetPublicFileResponse> & {
    fetch: () => Promise<void>;
  };

  optimizedAsset: OperationState<GetOptimizedFileResponse> & {
    fetch: (params?: OptimizedTransformParams) => Promise<void>;
  };

  deleteAsset: OperationState<DeleteFileResponse> & {
    execute: () => Promise<DeleteFileResponse | null>;
  };

  // ── MongoDB record operations ──────────────────────────────────────────────

  record: OperationState<GetFileRecordResponse> & {
    fetch: () => Promise<void>;
  };

  publicRecord: OperationState<GetPublicFileRecordResponse> & {
    fetch: () => Promise<void>;
  };

  history: OperationState<GetFileHistoryResponse> & {
    fetch: (params?: PaginationParams) => Promise<void>;
  };

  stats: OperationState<FileStatsResponse> & {
    fetch: () => Promise<void>;
  };

  metadata: OperationState<UpdateFileMetadataResponse> & {
    update: (body: FileMetadataUpdateBody) => Promise<UpdateFileMetadataResponse | null>;
  };

  archive: OperationState<ArchiveFileResponse> & {
    execute: () => Promise<ArchiveFileResponse | null>;
  };

  restore: OperationState<RestoreFileResponse> & {
    execute: (fileId: string) => Promise<RestoreFileResponse | null>;
  };

  deleteRecord: OperationState<DeleteFileRecordResponse> & {
    execute: () => Promise<DeleteFileRecordResponse | null>;
  };

  cleanup: OperationState<CleanupArchivedFilesResponse> & {
    execute: (daysOld?: number) => Promise<CleanupArchivedFilesResponse | null>;
  };

  // ── Utilities ──────────────────────────────────────────────────────────────

  // Clears all operation errors in one call — useful on modal close.
  clearErrors: () => void;

  // Resets all state back to initial — useful when entityId changes.
  reset: () => void;

  // Convenience flag — true while any operation is in-flight.
  isLoading: boolean;
}

// ─── File Picker Component Props ──────────────────────────────────────────────
// The reusable UI component that wraps the hook.

export interface FileManagerProps {
  entityType: FileEntityType;
  entityId?: string;

  // ── Display ────────────────────────────────────────────────────────────────

  label?: string;
  placeholder?: string;
  autoFetch?: boolean;
  autoFetchRecord?: boolean;
  showHistory?: boolean;
  showStats?: boolean;
  showMetadataEditor?: boolean;
  readOnly?: boolean;

  // ── Constraints ────────────────────────────────────────────────────────────

  accept?: string;              // MIME type filter for the file input
  maxSizeMB?: number;

  // ── Callbacks ─────────────────────────────────────────────────────────────

  onUploadSuccess?: (response: UploadFileResponse) => void;
  onUploadError?: (error: string) => void;
  onDeleteSuccess?: (response: DeleteFileResponse) => void;
  onFileSelect?: (file: File) => void;

  // ── Extra upload body fields ───────────────────────────────────────────────
  // Merged into FormData at upload time (e.g. custom tags, description).

  extraUploadFields?: Record<string, string>;

  className?: string;
}

// ─── History Panel Props ──────────────────────────────────────────────────────

export interface FileHistoryPanelProps {
  entityType: FileEntityType;
  entityId: string;
  onRestore?: (fileId: string) => void;
  paginationParams?: PaginationParams;
  className?: string;
}

// ─── Stats Panel Props ────────────────────────────────────────────────────────

export interface FileStatsPanelProps {
  entityType: FileEntityType;
  entityId: string;
  className?: string;
}