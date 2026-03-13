"use client";

// ─── FileManager ──────────────────────────────────────────────────────────────
// Universal file management component.
// Composes UploadZone, FilePreview, FileHistory, FileStats, MetadataEditor
// into a single cohesive panel driven by useFileManager.
//
// Usage examples:
//
//   // Profile picture — fetch on mount, show history
//   <FileManager entityType={FileEntityType.USER} entityId={userId}
//     autoFetch showHistory label="Profile Picture" />
//
//   // Service cover — orphan upload (entityId arrives after entity creation)
//   <FileManager entityType={FileEntityType.SERVICE}
//     onUploadSuccess={({ fileId }) => setServiceFormField("coverId", fileId)} />
//
//   // Booking attachment — participants only, no metadata editor
//   <FileManager entityType={FileEntityType.BOOKING} entityId={bookingId}
//     accept="image/*,application/pdf" showHistory />

import { useState } from "react";
import "./fileManager.css";
import { useFileManager } from "@/hooks/files/useFileManager";
import { FileManagerProps } from "@/types/files/manager.types";
import { FileHistory } from "./fileHistory";
import { FilePreview } from "./filePreview";
import { MetadataEditor, FileStats } from "./fileStateAndMataData";
import { UploadZone } from "./uploadZone";

export function FileManager({
  entityType,
  entityId,
  label = "File",
  placeholder,
  autoFetch = false,
  autoFetchRecord = false,
  showHistory = false,
  showStats = false,
  showMetadataEditor = false,
  readOnly = false,
  accept = "image/*",
  maxSizeMB = 10,
  onUploadSuccess,
  onUploadError,
  onDeleteSuccess,
  onFileSelect,
  extraUploadFields,
  className = "",
}: FileManagerProps) {
  const fm = useFileManager({
    entityType,
    entityId,
    autoFetch,
    autoFetchRecord,
  });

  // Panel visibility toggles
  const [historyOpen, setHistoryOpen] = useState(showHistory);
  const [statsOpen, setStatsOpen] = useState(showStats);
  const [metaOpen, setMetaOpen] = useState(showMetadataEditor);

  // ── Upload handler ──────────────────────────────────────────────────────────

  const handleFile = async (file: File) => {
    onFileSelect?.(file);
    const result = await fm.upload.execute(file, extraUploadFields);
    if (result) {
      onUploadSuccess?.(result);
      // Refresh the preview
      if (entityId) fm.asset.fetch();
    } else if (fm.upload.error) {
      onUploadError?.(fm.upload.error);
    }
  };

  // ── Delete handler ──────────────────────────────────────────────────────────

  const handleDeleteAsset = async () => {
    const result = await fm.deleteAsset.execute();
    if (result) onDeleteSuccess?.(result);
  };

  // ── Derived state ──────────────────────────────────────────────────────────

  const activeFile =
    fm.asset.data?.file ?? fm.record.data?.file ?? fm.upload.data?.file ?? null;

  const hasFile = !!activeFile;

  return (
    <div className={`fm-root ${className}`} data-entity={entityType}>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="fm-header">
        <span className="fm-header__label">{label}</span>
        <span className="fm-header__entity">
          {entityType.replace(/_/g, " ")}
        </span>

        {/* Global loading pulse */}
        {fm.isLoading && <span className="fm-spinner" aria-label="Loading" />}

        {/* Panel toggles */}
        <div className="fm-header__toggles">
          <button
            className={`fm-toggle ${statsOpen ? "fm-toggle--on" : ""}`}
            onClick={() => {
              setStatsOpen(!statsOpen);
              if (!statsOpen) fm.stats.fetch();
            }}
            title="Storage stats"
          >
            Stats
          </button>
          <button
            className={`fm-toggle ${historyOpen ? "fm-toggle--on" : ""}`}
            onClick={() => setHistoryOpen(!historyOpen)}
            title="File history"
          >
            History
          </button>
          {!readOnly && hasFile && (
            <button
              className={`fm-toggle ${metaOpen ? "fm-toggle--on" : ""}`}
              onClick={() => setMetaOpen(!metaOpen)}
              title="Edit metadata"
            >
              Meta
            </button>
          )}
        </div>
      </div>

      {/* ── Upload zone (hidden in readOnly mode if a file exists) ───────────── */}
      {(!readOnly || !hasFile) && (
        <UploadZone
          accept={accept}
          maxSizeMB={maxSizeMB}
          uploading={fm.upload.loading}
          progress={fm.upload.progress}
          error={fm.upload.error}
          onFile={handleFile}
          disabled={readOnly}
        />
      )}

      {/* ── Placeholder when no file ──────────────────────────────────────────── */}
      {!hasFile && !fm.asset.loading && !fm.upload.loading && (
        <div className="fm-empty">
          <span className="fm-empty__icon">⬜</span>
          <span className="fm-empty__text">
            {placeholder ?? `No ${label.toLowerCase()} uploaded yet`}
          </span>
        </div>
      )}

      {/* ── Asset loading skeleton ────────────────────────────────────────────── */}
      {fm.asset.loading && <div className="fm-skeleton" aria-hidden />}

      {/* ── Asset error ───────────────────────────────────────────────────────── */}
      {fm.asset.error && (
        <div className="fm-error-banner">
          <span>⚠ {fm.asset.error}</span>
          <button
            className="fm-btn fm-btn--ghost fm-btn--xs"
            onClick={fm.asset.fetch}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Active file preview ───────────────────────────────────────────────── */}
      {hasFile && (
        <FilePreview
          file={activeFile!}
          onArchive={!readOnly ? () => fm.archive.execute() : undefined}
          onDeleteAsset={!readOnly ? handleDeleteAsset : undefined}
          onDeleteRecord={
            !readOnly ? () => fm.deleteRecord.execute() : undefined
          }
          archiving={fm.archive.loading}
          deleting={fm.deleteAsset.loading || fm.deleteRecord.loading}
          readOnly={readOnly}
        />
      )}

      {/* ── Action errors ─────────────────────────────────────────────────────── */}
      {(fm.archive.error || fm.deleteAsset.error || fm.deleteRecord.error) && (
        <div className="fm-error-banner">
          <span>
            ⚠{" "}
            {fm.archive.error ?? fm.deleteAsset.error ?? fm.deleteRecord.error}
          </span>
          <button
            className="fm-btn fm-btn--ghost fm-btn--xs"
            onClick={fm.clearErrors}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Metadata editor ───────────────────────────────────────────────────── */}
      {metaOpen && !readOnly && hasFile && (
        <MetadataEditor
          initialDescription={activeFile?.description}
          initialTags={activeFile?.tags}
          metadataState={fm.metadata}
        />
      )}

      {/* ── Stats panel ───────────────────────────────────────────────────────── */}
      {statsOpen && entityId && <FileStats statsState={fm.stats} />}

      {/* ── History panel ─────────────────────────────────────────────────────── */}
      {historyOpen && entityId && (
        <FileHistory
          historyState={fm.history}
          restoreState={fm.restore}
          cleanupState={fm.cleanup}
          onRestore={() => {
            fm.asset.fetch();
            fm.record.fetch();
          }}
          readOnly={readOnly}
        />
      )}
    </div>
  );
}
