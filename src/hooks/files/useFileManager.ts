// ─── useFileManager ───────────────────────────────────────────────────────────
// Universal file management hook.
// One hook instance handles every entity type — profile pictures, covers,
// gallery images, ID documents, and attachments — without any branching in
// the consuming component.
//
// Design choices:
//   • Single useReducer drives all 13 operation slices, preventing the
//     39-useState-call anti-pattern and keeping resets/clear-errors trivial.
//   • API instance is memoized via useMemo keyed on entityType + label so it
//     is never recreated on unrelated re-renders.
//   • Every async handler is wrapped in useCallback for referential stability.
//   • Upload uses XHR under the hood (via FileManagerAPI.uploadFile) so
//     progress is a real 0–100 value, not a fake spinner.
//   • autoFetch / autoFetchRecord both fire in a single useEffect so mount
//     fetches never race each other.

"use client";

import { createProfilePictureAPI, createCategoryCoverAPI, createServiceCoverAPI, createClientIdImageAPI, createTaskAttachmentAPI, createBookingAttachmentAPI, createProviderAPI } from "@/factories/fileManageFactories";
import { FileManagerAPI } from "@/lib/api/file/files.api";
import { UploadFileResponse, GetFileResponse, GetPublicFileResponse, GetOptimizedFileResponse, DeleteFileResponse, GetFileRecordResponse, GetPublicFileRecordResponse, GetFileHistoryResponse, FileStatsResponse, UpdateFileMetadataResponse, ArchiveFileResponse, RestoreFileResponse, DeleteFileRecordResponse, CleanupArchivedFilesResponse, OptimizedTransformParams, PaginationParams, FileMetadataUpdateBody } from "@/types/files/file.api.types";
import { FileEntityType } from "@/types/files/files.types";
import { UseFileManagerReturn, OperationState } from "@/types/files/manager.types";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";


export interface UseFileManagerOptions {
  entityType: FileEntityType;

  // Required for entity-scoped operations (all reads, writes, deletes).
  // May be omitted when the hook is mounted before the entity exists
  // (orphan-mode upload flow).
  entityId?: string;

  // Only relevant when entityType === PROVIDER_PROFILE.
  // Defaults to "provider_gallery".
  providerLabel?: "provider_gallery" | "provider_id_image";

  // Fetch the active Cloudinary asset on mount.
  autoFetch?: boolean;

  // Fetch the MongoDB record on mount (runs alongside autoFetch if both set).
  autoFetchRecord?: boolean;

  // Optional route prefix override — forwarded to the API factory.
  routePrefix?: string;

  // Optional base URL override — forwarded to the API factory.
  baseURL?: string;
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

type OperationKey =
  | "upload"
  | "asset"
  | "publicAsset"
  | "optimizedAsset"
  | "deleteAsset"
  | "record"
  | "publicRecord"
  | "history"
  | "stats"
  | "metadata"
  | "archive"
  | "restore"
  | "deleteRecord"
  | "cleanup";

interface SliceState<T = unknown> {
  data:     T | null;
  loading:  boolean;
  error:    string | null;
}

interface FileManagerState {
  upload:         SliceState<UploadFileResponse> & { progress: number };
  asset:          SliceState<GetFileResponse>;
  publicAsset:    SliceState<GetPublicFileResponse>;
  optimizedAsset: SliceState<GetOptimizedFileResponse>;
  deleteAsset:    SliceState<DeleteFileResponse>;
  record:         SliceState<GetFileRecordResponse>;
  publicRecord:   SliceState<GetPublicFileRecordResponse>;
  history:        SliceState<GetFileHistoryResponse>;
  stats:          SliceState<FileStatsResponse>;
  metadata:       SliceState<UpdateFileMetadataResponse>;
  archive:        SliceState<ArchiveFileResponse>;
  restore:        SliceState<RestoreFileResponse>;
  deleteRecord:   SliceState<DeleteFileRecordResponse>;
  cleanup:        SliceState<CleanupArchivedFilesResponse>;
}

type Action =
  | { type: "SET_LOADING";  key: OperationKey }
  | { type: "SET_DATA";     key: OperationKey; data: unknown }
  | { type: "SET_ERROR";    key: OperationKey; error: string }
  | { type: "SET_PROGRESS"; progress: number }
  | { type: "CLEAR_ERRORS" }
  | { type: "RESET" };

const emptySlice = <T>(): SliceState<T> => ({
  data: null, loading: false, error: null,
});

const initialState: FileManagerState = {
  upload:         { ...emptySlice<UploadFileResponse>(), progress: 0 },
  asset:          emptySlice<GetFileResponse>(),
  publicAsset:    emptySlice<GetPublicFileResponse>(),
  optimizedAsset: emptySlice<GetOptimizedFileResponse>(),
  deleteAsset:    emptySlice<DeleteFileResponse>(),
  record:         emptySlice<GetFileRecordResponse>(),
  publicRecord:   emptySlice<GetPublicFileRecordResponse>(),
  history:        emptySlice<GetFileHistoryResponse>(),
  stats:          emptySlice<FileStatsResponse>(),
  metadata:       emptySlice<UpdateFileMetadataResponse>(),
  archive:        emptySlice<ArchiveFileResponse>(),
  restore:        emptySlice<RestoreFileResponse>(),
  deleteRecord:   emptySlice<DeleteFileRecordResponse>(),
  cleanup:        emptySlice<CleanupArchivedFilesResponse>(),
};

function reducer(state: FileManagerState, action: Action): FileManagerState {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        [action.key]: { ...state[action.key], loading: true, error: null },
      };

    case "SET_DATA":
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          loading: false,
          error:   null,
          data:    action.data,
          // Reset progress to 100 when upload succeeds
          ...(action.key === "upload" ? { progress: 100 } : {}),
        },
      };

    case "SET_ERROR":
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          loading: false,
          error:   action.error,
          // Reset progress on upload error
          ...(action.key === "upload" ? { progress: 0 } : {}),
        },
      };

    case "SET_PROGRESS":
      return {
        ...state,
        upload: { ...state.upload, progress: action.progress },
      };

    case "CLEAR_ERRORS": {
      const next = { ...state } as FileManagerState;
      (Object.keys(next) as OperationKey[]).forEach((k) => {
        if (next[k].error) {
          (next[k] as SliceState) = { ...next[k], error: null };
        }
      });
      return next;
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// ─── API Factory ──────────────────────────────────────────────────────────────

function buildAPI(opts: UseFileManagerOptions): FileManagerAPI {
  const apiOpts = {
    ...(opts.routePrefix && { routePrefix: opts.routePrefix }),
    ...(opts.baseURL     && { baseURL:      opts.baseURL     }),
  };

  switch (opts.entityType) {
    case FileEntityType.USER:
      return createProfilePictureAPI(apiOpts);
    case FileEntityType.CATEGORY:
      return createCategoryCoverAPI(apiOpts);
    case FileEntityType.SERVICE:
      return createServiceCoverAPI(apiOpts);
    case FileEntityType.CLIENT_PROFILE:
      return createClientIdImageAPI(apiOpts);
    case FileEntityType.TASK:
      return createTaskAttachmentAPI(apiOpts);
    case FileEntityType.BOOKING:
      return createBookingAttachmentAPI(apiOpts);
    case FileEntityType.PROVIDER_PROFILE:
      return createProviderAPI(opts.providerLabel ?? "provider_gallery", apiOpts);
    default:
      throw new Error(
        `[useFileManager] No API factory registered for entityType "${opts.entityType}"`
      );
  }
}

// ─── Async Wrapper ────────────────────────────────────────────────────────────
// Normalises the error → string conversion so every handler is DRY.

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "An unexpected error occurred";
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFileManager(opts: UseFileManagerOptions): UseFileManagerReturn {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Memoize the API instance — only recreate when identity-relevant options
  // change. Stringify the full opts object so every field is tracked.
  const api = useMemo(
    () => buildAPI(opts),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [opts.entityType, opts.providerLabel, opts.routePrefix, opts.baseURL]
  );

  // Keep entityId in a ref so callbacks can always read the current value
  // without needing to be recreated when it changes between renders.
  const entityIdRef = useRef(opts.entityId);
  useEffect(() => { entityIdRef.current = opts.entityId; }, [opts.entityId]);

  // Helper — resolves entityId and throws if missing
  const requireEntityId = useCallback((): string => {
    const id = entityIdRef.current;
    if (!id) throw new Error("[useFileManager] entityId is required for this operation");
    return id;
  }, []);

  // ── Generic operation runner ───────────────────────────────────────────────
  // Handles loading → success/error dispatch for any async operation.

  const run = useCallback(
    async <T>(key: OperationKey, fn: () => Promise<T>): Promise<T | null> => {
      dispatch({ type: "SET_LOADING", key });
      try {
        const result = await fn();
        dispatch({ type: "SET_DATA", key, data: result });
        return result;
      } catch (err) {
        dispatch({ type: "SET_ERROR", key, error: extractErrorMessage(err) });
        return null;
      }
    },
    []
  );

  // ── Upload ─────────────────────────────────────────────────────────────────

  const executeUpload = useCallback(
    async (
      file: File,
      extraBody?: Record<string, string>
    ): Promise<UploadFileResponse | null> => {
      dispatch({ type: "SET_LOADING", key: "upload" });
      dispatch({ type: "SET_PROGRESS", progress: 0 });

      try {
        const result = await api.uploadFile(
          file,
          entityIdRef.current,
          extraBody,
          (percent) => dispatch({ type: "SET_PROGRESS", progress: percent })
        );
        dispatch({ type: "SET_DATA", key: "upload", data: result });
        return result;
      } catch (err) {
        dispatch({ type: "SET_ERROR", key: "upload", error: extractErrorMessage(err) });
        return null;
      }
    },
    [api]
  );

  // ── Cloudinary asset ───────────────────────────────────────────────────────

  const fetchAsset = useCallback(async () => {
    await run("asset", () => api.getFile(requireEntityId()));
  }, [api, requireEntityId, run]);

  const fetchPublicAsset = useCallback(async () => {
    await run("publicAsset", () => api.getPublicFile(requireEntityId()));
  }, [api, requireEntityId, run]);

  const fetchOptimizedAsset = useCallback(
    async (params?: OptimizedTransformParams) => {
      await run("optimizedAsset", () =>
        api.getOptimizedFile(requireEntityId(), params)
      );
    },
    [api, requireEntityId, run]
  );

  const executeDeleteAsset = useCallback(
    async (): Promise<DeleteFileResponse | null> =>
      run("deleteAsset", () => api.deleteFile(requireEntityId())),
    [api, requireEntityId, run]
  );

  // ── MongoDB record ─────────────────────────────────────────────────────────

  const fetchRecord = useCallback(async () => {
    await run("record", () => api.getFileRecord(requireEntityId()));
  }, [api, requireEntityId, run]);

  const fetchPublicRecord = useCallback(async () => {
    await run("publicRecord", () => api.getPublicFileRecord(requireEntityId()));
  }, [api, requireEntityId, run]);

  const fetchHistory = useCallback(
    async (params?: PaginationParams) => {
      await run("history", () => api.getFileHistory(requireEntityId(), params));
    },
    [api, requireEntityId, run]
  );

  const fetchStats = useCallback(async () => {
    await run("stats", () => api.getFileStats(requireEntityId()));
  }, [api, requireEntityId, run]);

  const updateMetadata = useCallback(
    async (body: FileMetadataUpdateBody): Promise<UpdateFileMetadataResponse | null> =>
      run("metadata", () => api.updateFileMetadata(requireEntityId(), body)),
    [api, requireEntityId, run]
  );

  const executeArchive = useCallback(
    async (): Promise<ArchiveFileResponse | null> =>
      run("archive", () => api.archiveFile(requireEntityId())),
    [api, requireEntityId, run]
  );

  const executeRestore = useCallback(
    async (fileId: string): Promise<RestoreFileResponse | null> =>
      run("restore", () => api.restoreFile(requireEntityId(), fileId)),
    [api, requireEntityId, run]
  );

  const executeDeleteRecord = useCallback(
    async (): Promise<DeleteFileRecordResponse | null> =>
      run("deleteRecord", () => api.deleteFileRecord(requireEntityId())),
    [api, requireEntityId, run]
  );

  const executeCleanup = useCallback(
    async (daysOld?: number): Promise<CleanupArchivedFilesResponse | null> =>
      run("cleanup", () => api.cleanupArchivedFiles(requireEntityId(), daysOld)),
    [api, requireEntityId, run]
  );

  // ── Utilities ──────────────────────────────────────────────────────────────

  const clearErrors = useCallback(() => dispatch({ type: "CLEAR_ERRORS" }), []);
  const reset       = useCallback(() => dispatch({ type: "RESET"        }), []);

  // ── Auto-fetch on mount ────────────────────────────────────────────────────
  // Both fetches run concurrently. Neither blocks the other.
  // Guards on entityId — no point fetching without one.

  useEffect(() => {
    if (!opts.entityId) return;
    if (opts.autoFetch)       fetchAsset();
    if (opts.autoFetchRecord) fetchRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.entityId, opts.autoFetch, opts.autoFetchRecord]);

  // ── isLoading convenience flag ─────────────────────────────────────────────

  const isLoading = (Object.keys(state) as OperationKey[]).some(
    (k) => state[k].loading
  );

  // ── Assemble return value ──────────────────────────────────────────────────

  return {
    upload: {
      ...(state.upload as OperationState<UploadFileResponse>),
      progress: state.upload.progress,
      execute:  executeUpload,
    },

    asset: {
      ...(state.asset as OperationState<GetFileResponse>),
      fetch: fetchAsset,
    },

    publicAsset: {
      ...(state.publicAsset as OperationState<GetPublicFileResponse>),
      fetch: fetchPublicAsset,
    },

    optimizedAsset: {
      ...(state.optimizedAsset as OperationState<GetOptimizedFileResponse>),
      fetch: fetchOptimizedAsset,
    },

    deleteAsset: {
      ...(state.deleteAsset as OperationState<DeleteFileResponse>),
      execute: executeDeleteAsset,
    },

    record: {
      ...(state.record as OperationState<GetFileRecordResponse>),
      fetch: fetchRecord,
    },

    publicRecord: {
      ...(state.publicRecord as OperationState<GetPublicFileRecordResponse>),
      fetch: fetchPublicRecord,
    },

    history: {
      ...(state.history as OperationState<GetFileHistoryResponse>),
      fetch: fetchHistory,
    },

    stats: {
      ...(state.stats as OperationState<FileStatsResponse>),
      fetch: fetchStats,
    },

    metadata: {
      ...(state.metadata as OperationState<UpdateFileMetadataResponse>),
      update: updateMetadata,
    },

    archive: {
      ...(state.archive as OperationState<ArchiveFileResponse>),
      execute: executeArchive,
    },

    restore: {
      ...(state.restore as OperationState<RestoreFileResponse>),
      execute: executeRestore,
    },

    deleteRecord: {
      ...(state.deleteRecord as OperationState<DeleteFileRecordResponse>),
      execute: executeDeleteRecord,
    },

    cleanup: {
      ...(state.cleanup as OperationState<CleanupArchivedFilesResponse>),
      execute: executeCleanup,
    },

    clearErrors,
    reset,
    isLoading,
  };
}